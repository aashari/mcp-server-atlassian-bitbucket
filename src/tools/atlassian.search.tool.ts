import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Logger } from '../utils/logger.util.js';

// Set up logger
const logger = Logger.forContext('tools/atlassian.search.tool.ts');

/**
 * Register the search tools with the MCP server
 *
 * NOTE: bb_search has been replaced by the generic bb_get tool.
 * Use the following paths:
 * - Code search: bb_get({ path: "/search/code", queryParams: { search_query: "query", workspace: "myteam" } })
 * - Repository search: bb_get({ path: "/repositories/{workspace}", queryParams: { q: "query" } })
 * - Pull request search: bb_get({ path: "/repositories/{workspace}/{repo_slug}/pullrequests", queryParams: { q: "query" } })
 *
 * For code search, the Bitbucket API uses the /search/code endpoint.
 * The bb_get tool now supports flexible API endpoint access via the path parameter.
 */
function registerTools(_server: McpServer) {
	logger.debug(
		'Search tools deprecated - use bb_get instead. No tools to register.',
	);
}

export default { registerTools };
