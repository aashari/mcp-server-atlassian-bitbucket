#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { Logger } from './utils/logger.util.js';
import { config } from './utils/config.util.js';
import { createUnexpectedError } from './utils/error.util.js';
import { VERSION, PACKAGE_NAME } from './utils/constants.util.js';
import { runCli } from './cli/index.js';

// Import Bitbucket-specific tools
import atlassianWorkspaces from './tools/atlassian.workspaces.tool.js';
import atlassianRepositories from './tools/atlassian.repositories.tool.js';
import atlassianPullRequests from './tools/atlassian.pullrequests.tool.js';
import atlassianSearch from './tools/atlassian.search.tool.js';
import atlassianDiff from './tools/atlassian.diff.tool.js';

// Create a contextualized logger for this file
const indexLogger = Logger.forContext('index.ts');

// Log initialization at debug level
indexLogger.debug('Bitbucket MCP server module loaded');

let serverInstance: McpServer | null = null;
let transportInstance: SSEServerTransport | StdioServerTransport | null = null;

/**
 * Start the MCP server with the specified transport mode
 *
 * @param mode The transport mode to use (stdio or sse)
 * @returns Promise that resolves to the server instance when started successfully
 */
export async function startServer(mode: 'stdio' | 'sse' = 'stdio') {
	// Create method-level logger with more specific context
	const serverLogger = Logger.forContext('index.ts', 'startServer');

	// Load configuration
	serverLogger.info('Starting MCP server initialization...');
	config.load();
	serverLogger.info('Configuration loaded successfully');

	// Enable debug logging if DEBUG is set to true
	if (config.getBoolean('DEBUG')) {
		serverLogger.debug('Debug mode enabled');
	}

	// Log debug configuration settings at debug level
	serverLogger.debug(`DEBUG environment variable: ${process.env.DEBUG}`);
	serverLogger.debug(
		`ATLASSIAN_API_TOKEN exists: ${Boolean(process.env.ATLASSIAN_API_TOKEN)}`,
	);
	serverLogger.debug(`Config DEBUG value: ${config.get('DEBUG')}`);

	serverLogger.info(`Initializing Bitbucket MCP server v${VERSION}`);
	serverInstance = new McpServer({
		name: PACKAGE_NAME,
		version: VERSION,
	});

	if (mode === 'stdio') {
		serverLogger.info('Using STDIO transport for MCP communication');
		transportInstance = new StdioServerTransport();
	} else {
		throw createUnexpectedError('SSE mode is not supported yet');
	}

	// Register tools
	serverLogger.info('Registering MCP tools...');

	atlassianWorkspaces.registerTools(serverInstance);
	serverLogger.debug('Registered Workspaces tools');

	atlassianRepositories.registerTools(serverInstance);
	serverLogger.debug('Registered Repositories tools');

	atlassianPullRequests.registerTools(serverInstance);
	serverLogger.debug('Registered Pull requests tools');

	atlassianSearch.registerTools(serverInstance);
	serverLogger.debug('Registered Search tools');

	atlassianDiff.registerTools(serverInstance);
	serverLogger.debug('Registered Diff tools');

	serverLogger.info('All tools registered successfully');

	try {
		serverLogger.info(`Connecting to ${mode.toUpperCase()} transport...`);
		await serverInstance.connect(transportInstance);
		serverLogger.info(
			'MCP server started successfully and ready to process requests',
		);
		return serverInstance;
	} catch (err) {
		serverLogger.error(`Failed to start server`, err);
		process.exit(1);
	}
}

/**
 * Main entry point - this will run when executed directly
 * Determines whether to run in CLI or server mode based on command-line arguments
 */
async function main() {
	// Create method-level logger with more specific context
	const mainLogger = Logger.forContext('index.ts', 'main');

	// Load configuration
	config.load();

	// Check if arguments are provided (CLI mode)
	if (process.argv.length > 2) {
		// CLI mode: Pass arguments to CLI runner
		mainLogger.info('Starting in CLI mode');
		await runCli(process.argv.slice(2));
		mainLogger.info('CLI execution completed');
	} else {
		// MCP Server mode: Start server with default STDIO
		mainLogger.info('Starting in server mode');
		await startServer();
		mainLogger.info('Server is now running');
	}
}

// If this file is being executed directly (not imported), run the main function
if (require.main === module) {
	main().catch((err) => {
		indexLogger.error('Unhandled error in main process', err);
		process.exit(1);
	});
}
