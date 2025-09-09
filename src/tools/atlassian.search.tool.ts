import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Logger } from '../utils/logger.util.js';
import {
	SearchToolArgsSchema,
	type SearchToolArgsType,
} from './atlassian.search.types.js';
import atlassianSearchController from '../controllers/atlassian.search.controller.js';
import { formatErrorForMcpTool } from '../utils/error.util.js';
import { getDefaultWorkspace } from '../utils/workspace.util.js';

// Set up logger
const logger = Logger.forContext('tools/atlassian.search.tool.ts');

/**
 * Handle search command in MCP
 */
async function handleSearch(args: Record<string, unknown>) {
	// Create a method-scoped logger
	const methodLogger = logger.forMethod('handleSearch');

	try {
		methodLogger.debug('Search tool called with args:', args);

		// Handle workspace similar to CLI implementation
		let workspace = args.workspaceSlug;
		if (!workspace) {
			const defaultWorkspace = await getDefaultWorkspace();
			if (!defaultWorkspace) {
				return {
					content: [
						{
							type: 'text' as const,
							text: 'Error: No workspace provided and no default workspace configured',
						},
					],
				};
			}
			workspace = defaultWorkspace;
			methodLogger.debug(`Using default workspace: ${workspace}`);
		}

		// Pass args to controller with workspace added
		const searchArgs: SearchToolArgsType = {
			workspaceSlug: workspace as string,
			repoSlug: args.repoSlug as string | undefined,
			query: args.query as string,
			scope:
				(args.scope as
					| 'code'
					| 'content'
					| 'repositories'
					| 'pullrequests') || 'code',
			contentType: args.contentType as string | undefined,
			language: args.language as string | undefined,
			extension: args.extension as string | undefined,
			limit: args.limit as number | undefined,
			cursor: args.cursor as string | undefined,
		};

		// Call the controller with proper parameter mapping
		const controllerOptions = {
			workspace: searchArgs.workspaceSlug,
			repo: searchArgs.repoSlug,
			query: searchArgs.query,
			type: searchArgs.scope,
			contentType: searchArgs.contentType,
			language: searchArgs.language,
			extension: searchArgs.extension,
			limit: searchArgs.limit,
			cursor: searchArgs.cursor,
		};

		const result = await atlassianSearchController.search(
			controllerOptions as Parameters<
				typeof atlassianSearchController.search
			>[0],
		);

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
