import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Logger } from '../utils/logger.util.js';
import {
	SearchToolArgsSchema,
	SearchToolArgsType,
} from './atlassian.search.types.js';
import atlassianSearchController from '../controllers/atlassian.search.controller.js';
import { formatErrorForMcpTool } from '../utils/error.util.js';

// Set up logger
const logger = Logger.forContext('tools/atlassian.search.tool.ts');

/**
 * Handle search command in MCP
 */
async function handleSearch(args: SearchToolArgsType) {
	// Create a method-scoped logger
	const methodLogger = logger.forMethod('handleSearch');

	try {
		methodLogger.debug('Search tool called with args:', args);

		// Call the controller directly with the tool arguments
		// The controller now handles default workspace logic and expects parameters
		// that align with SearchToolArgsType (e.g., workspaceSlug, repoSlug, scope).
		const result = await atlassianSearchController.search(args);

		// Return the result content in MCP format
		return {
			content: [{ type: 'text' as const, text: result.content }],
		};
	} catch (error) {
		// Log the error
		methodLogger.error('Search tool failed:', error);

		// Format the error for MCP response
		return formatErrorForMcpTool(error);
	}
}

/**
 * Register the search tools with the MCP server
 */
function registerTools(server: McpServer) {
	// Register the search tool using the schema shape
	server.tool(
		'bb_search',
		'Searches Bitbucket for content matching the provided query. Use this tool to find repositories, code, pull requests, or other content in Bitbucket. Specify `scope` to narrow your search ("code", "repositories", "pullrequests", or "content"). Filter code searches by `language` or `extension`. Filter content searches by `contentType`. Only searches within the specified `workspaceSlug` and optionally within a specific `repoSlug`. Supports pagination via `limit` and `cursor`. Requires Atlassian Bitbucket credentials configured. Returns search results as Markdown.',
		SearchToolArgsSchema.shape,
		handleSearch,
	);

	logger.debug('Successfully registered Bitbucket search tools');
}

export default { registerTools };
