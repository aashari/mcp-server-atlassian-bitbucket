import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Logger } from '../utils/logger.util.js';

// Create a contextualized logger for this file
const toolLogger = Logger.forContext('tools/atlassian.workspaces.tool.ts');

// Log tool initialization
toolLogger.debug('Bitbucket workspaces tool initialized');

/**
 * Register all Bitbucket workspace tools with the MCP server.
 *
 * NOTE: bb_ls_workspaces has been replaced by the generic bb_get tool.
 * Use: bb_get({ path: "/user/permissions/workspaces" })
 *
 * NOTE: bb_get_workspace has been replaced by the generic bb_get tool.
 * Use: bb_get({ path: "/workspaces/{workspace_slug}" })
 */
function registerTools(_server: McpServer) {
	const registerLogger = Logger.forContext(
		'tools/atlassian.workspaces.tool.ts',
		'registerTools',
	);
	registerLogger.debug(
		'Workspaces tools deprecated - use bb_get instead. No tools to register.',
	);
}

export default { registerTools };
