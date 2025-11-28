import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Logger } from '../utils/logger.util.js';

// Set up logger
const logger = Logger.forContext('tools/atlassian.search.tool.ts');

/**
 * Register the search tools with the MCP server
 */
function registerTools(_server: McpServer) {
	logger.debug('No search tools to register.');
}

export default { registerTools };
