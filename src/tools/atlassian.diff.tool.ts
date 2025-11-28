import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Logger } from '../utils/logger.util.js';

// Create a contextualized logger for this file
const toolLogger = Logger.forContext('tools/atlassian.diff.tool.ts');

// Log tool initialization
toolLogger.debug('Bitbucket diff tool initialized');

/**
 * Register all Bitbucket diff tools with the MCP server.
 */
function registerTools(_server: McpServer) {
	const registerLogger = Logger.forContext(
		'tools/atlassian.diff.tool.ts',
		'registerTools',
	);
	registerLogger.debug('No diff tools to register.');
}

export default { registerTools };
