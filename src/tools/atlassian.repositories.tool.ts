import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Logger } from '../utils/logger.util.js';
import { formatErrorForMcpTool } from '../utils/error.util.js';
import { truncateForAI } from '../utils/formatter.util.js';
import {
	CloneRepositoryToolArgs,
	type CloneRepositoryToolArgsType,
} from './atlassian.repositories.types.js';

// Import directly from specialized controllers
import { handleCloneRepository } from '../controllers/atlassian.repositories.content.controller.js';

// Create a contextualized logger for this file
const toolLogger = Logger.forContext('tools/atlassian.repositories.tool.ts');

// Log tool initialization
toolLogger.debug('Bitbucket repositories tool initialized');

/**
 * Handler for cloning a repository.
 */
async function handleRepoClone(args: Record<string, unknown>) {
	const methodLogger = Logger.forContext(
		'tools/atlassian.repositories.tool.ts',
		'handleRepoClone',
	);
	try {
		methodLogger.debug('Cloning repository:', args);

		// Pass args directly to controller
		const result = await handleCloneRepository(
			args as CloneRepositoryToolArgsType,
		);

		methodLogger.debug('Successfully cloned repository via controller');

		return {
			content: [
				{
					type: 'text' as const,
					text: truncateForAI(result.content, result.rawResponsePath),
				},
			],
		};
	} catch (error) {
		methodLogger.error('Failed to clone repository', error);
		return formatErrorForMcpTool(error);
	}
}

// Tool description
const BB_CLONE_DESCRIPTION = `Clone a Bitbucket repository to your local filesystem using SSH (preferred) or HTTPS.

Provide \`repoSlug\` and \`targetPath\` (absolute path). Clones into \`targetPath/repoSlug\`. SSH keys must be configured; falls back to HTTPS if unavailable.`;

/**
 * Register all Bitbucket repository tools with the MCP server.
 * Uses the modern registerTool API (SDK v1.22.0+) instead of deprecated tool() method.
 *
 * Branch creation is now handled by bb_post tool.
 */
function registerTools(server: McpServer) {
	const registerLogger = Logger.forContext(
		'tools/atlassian.repositories.tool.ts',
		'registerTools',
	);
	registerLogger.debug('Registering Repository tools...');

	// Register the clone repository tool using modern registerTool API
	server.registerTool(
		'bb_clone',
		{
			title: 'Clone Bitbucket Repository',
			description: BB_CLONE_DESCRIPTION,
			inputSchema: CloneRepositoryToolArgs,
		},
		handleRepoClone,
	);

	registerLogger.debug('Successfully registered Repository tools');
}

export default { registerTools };
