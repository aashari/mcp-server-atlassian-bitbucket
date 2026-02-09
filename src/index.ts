#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { Logger } from './utils/logger.util.js';
import { config } from './utils/config.util.js';
import { VERSION, PACKAGE_NAME } from './utils/constants.util.js';
import { runCli } from './cli/index.js';
import type { Request, Response } from 'express';
import express from 'express';
import cors from 'cors';

// Import tools
import atlassianApi from './tools/atlassian.api.tool.js';
import atlassianRepositories from './tools/atlassian.repositories.tool.js';
import { getAtlassianCredentials } from './utils/transport.util.js';

// Create a contextualized logger for this file
const indexLogger = Logger.forContext('index.ts');

// Log initialization at debug level
indexLogger.debug('Bitbucket MCP server module loaded');

let serverInstance: McpServer | null = null;
let transportInstance:
	| StreamableHTTPServerTransport
	| StdioServerTransport
	| null = null;

/**
 * Start the MCP server with the specified transport mode
 *
 * @param mode The transport mode to use (stdio or http)
 * @returns Promise that resolves to the server instance when started successfully
 */
export async function startServer(
	mode: 'stdio' | 'http' = 'stdio',
): Promise<McpServer> {
	const serverLogger = Logger.forContext('index.ts', 'startServer');

	// Load configuration
	serverLogger.info('Starting MCP server initialization...');
	config.load();

	if (config.getBoolean('DEBUG')) {
		serverLogger.debug('Debug mode enabled');
	}

	// Validate authentication credentials before starting the server
	const credentials = getAtlassianCredentials();
	if (!credentials) {
		const errorMessage = [
			'ERROR: Authentication credentials are missing.',
			'',
			'The Bitbucket MCP server requires valid credentials to start.',
			'Please configure one of the following:',
			'',
			'  Option 1 - Atlassian credentials:',
			'    ATLASSIAN_USER_EMAIL=<your-email>',
			'    ATLASSIAN_API_TOKEN=<your-api-token>',
			'',
			'  Option 2 - Bitbucket App Password:',
			'    ATLASSIAN_BITBUCKET_USERNAME=<your-username>',
			'    ATLASSIAN_BITBUCKET_APP_PASSWORD=<your-app-password>',
			'',
			'Set these as environment variables, in a .env file, or in ~/.mcp/configs.json',
		].join('\n');

		process.stderr.write(errorMessage + '\n');
		serverLogger.error(
			'Server startup aborted: authentication credentials are missing',
		);
		process.exit(1);
	}

	serverLogger.info(`Initializing Bitbucket MCP server v${VERSION}`);
	serverInstance = new McpServer({
		name: PACKAGE_NAME,
		version: VERSION,
	});

	// Register all tools
	serverLogger.info('Registering MCP tools...');
	atlassianApi.registerTools(serverInstance);
	atlassianRepositories.registerTools(serverInstance);
	serverLogger.info('All tools registered successfully');

	if (mode === 'stdio') {
		// STDIO Transport
		serverLogger.info('Using STDIO transport for MCP communication');
		transportInstance = new StdioServerTransport();

		try {
			await serverInstance.connect(transportInstance);
			serverLogger.info(
				'MCP server started successfully on STDIO transport',
			);
			setupGracefulShutdown();
			return serverInstance;
		} catch (err) {
			serverLogger.error(
				'Failed to start server on STDIO transport',
				err,
			);
			process.exit(1);
		}
	} else {
		// HTTP Transport with Express
		serverLogger.info(
			'Using Streamable HTTP transport for MCP communication',
		);

		const app = express();
		app.use(cors());
		app.use(express.json());

		const mcpEndpoint = '/mcp';
		serverLogger.debug(`MCP endpoint: ${mcpEndpoint}`);

		// Create transport instance
		const transport = new StreamableHTTPServerTransport({
			sessionIdGenerator: undefined,
		});

		// Connect server to transport
		await serverInstance.connect(transport);
		transportInstance = transport;

		// Handle all MCP requests
		app.all(mcpEndpoint, (req: Request, res: Response) => {
			transport
				.handleRequest(req, res, req.body)
				.catch((err: unknown) => {
					serverLogger.error('Error in transport.handleRequest', err);
					if (!res.headersSent) {
						res.status(500).json({
							error: 'Internal Server Error',
						});
					}
				});
		});

		// Health check endpoint
		app.get('/', (_req: Request, res: Response) => {
			res.send(`Bitbucket MCP Server v${VERSION} is running`);
		});

		// Start HTTP server
		const PORT = Number(process.env.PORT ?? 3000);
		await new Promise<void>((resolve) => {
			app.listen(PORT, () => {
				serverLogger.info(
					`HTTP transport listening on http://localhost:${PORT}${mcpEndpoint}`,
				);
				resolve();
			});
		});

		setupGracefulShutdown();
		return serverInstance;
	}
}

/**
 * Main entry point - this will run when executed directly
 * Determines whether to run in CLI or server mode based on command-line arguments
 */
async function main() {
	const mainLogger = Logger.forContext('index.ts', 'main');

	// Load configuration
	config.load();

	// CLI mode - if any arguments are provided
	if (process.argv.length > 2) {
		mainLogger.info('Starting in CLI mode');
		await runCli(process.argv.slice(2));
		mainLogger.info('CLI execution completed');
		return;
	}

	// Server mode - determine transport
	const transportMode = (process.env.TRANSPORT_MODE || 'stdio').toLowerCase();
	let mode: 'http' | 'stdio';

	if (transportMode === 'stdio') {
		mode = 'stdio';
	} else if (transportMode === 'http') {
		mode = 'http';
	} else {
		mainLogger.warn(
			`Unknown TRANSPORT_MODE "${transportMode}", defaulting to stdio`,
		);
		mode = 'stdio';
	}

	mainLogger.info(`Starting server with ${mode.toUpperCase()} transport`);
	await startServer(mode);
	mainLogger.info('Server is now running');
}

/**
 * Set up graceful shutdown handlers for the server
 */
function setupGracefulShutdown() {
	const shutdownLogger = Logger.forContext('index.ts', 'shutdown');

	const shutdown = async () => {
		try {
			shutdownLogger.info('Shutting down gracefully...');

			if (
				transportInstance &&
				'close' in transportInstance &&
				typeof transportInstance.close === 'function'
			) {
				await transportInstance.close();
			}

			if (serverInstance && typeof serverInstance.close === 'function') {
				await serverInstance.close();
			}

			process.exit(0);
		} catch (err) {
			shutdownLogger.error('Error during shutdown', err);
			process.exit(1);
		}
	};

	['SIGINT', 'SIGTERM'].forEach((signal) => {
		process.on(signal as NodeJS.Signals, shutdown);
	});
}

// If this file is being executed directly (not imported), run the main function
if (require.main === module) {
	main().catch((err) => {
		indexLogger.error('Unhandled error in main process', err);
		process.exit(1);
	});
}
