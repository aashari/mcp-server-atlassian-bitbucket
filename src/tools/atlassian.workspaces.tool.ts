import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Logger } from '../utils/logger.util.js';

// Create a contextualized logger for this file
const toolLogger = Logger.forContext('tools/atlassian.workspaces.tool.ts');

// Log tool initialization
toolLogger.debug('Bitbucket workspaces tool initialized');

/**
 * Register all Bitbucket workspace tools with the MCP server.
 */
function registerTools(_server: McpServer) {
	const registerLogger = Logger.forContext(
		'tools/atlassian.workspaces.tool.ts',
		'registerTools',
	);
	registerLogger.debug('No workspace tools to register.');
}

export default { registerTools };
