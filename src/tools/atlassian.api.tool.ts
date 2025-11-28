import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Logger } from '../utils/logger.util.js';
import { formatErrorForMcpTool } from '../utils/error.util.js';
import {
	GetApiToolArgs,
	type GetApiToolArgsType,
} from './atlassian.api.types.js';
import { handleGet } from '../controllers/atlassian.api.controller.js';

// Create a contextualized logger for this file
const toolLogger = Logger.forContext('tools/atlassian.api.tool.ts');

// Log tool initialization
toolLogger.debug('Bitbucket API tool initialized');

/**
 * MCP Tool: Generic Bitbucket GET Request
 *
 * Makes a GET request to any Bitbucket API endpoint.
 * Returns raw JSON response with optional JMESPath filtering.
 *
 * @param args - Tool arguments containing path, queryParams, and optional jq filter
 * @returns MCP response with JSON data
 * @throws Will return error message if request fails
 */
async function get(args: Record<string, unknown>) {
	const methodLogger = Logger.forContext(
		'tools/atlassian.api.tool.ts',
		'get',
	);
	methodLogger.debug('Making GET request with args:', args);

	try {
		const result = await handleGet(args as GetApiToolArgsType);

		methodLogger.debug('Successfully retrieved response from controller');

		return {
			content: [
				{
					type: 'text' as const,
					text: result.content,
				},
			],
		};
	} catch (error) {
		methodLogger.error('Failed to make GET request', error);
		return formatErrorForMcpTool(error);
	}
}

/**
 * Register generic Bitbucket API tool with the MCP server.
 */
function registerTools(server: McpServer) {
	const registerLogger = Logger.forContext(
		'tools/atlassian.api.tool.ts',
		'registerTools',
	);
	registerLogger.debug('Registering API tools...');

	// Register the generic GET tool
	server.tool(
		'bb_get',
		`Fetches any Bitbucket Cloud REST API endpoint. Returns raw JSON (optionally filtered via JMESPath).

This is the primary tool for reading Bitbucket data—workspaces, repositories, pull requests, commits, branches, file contents, diffs, and more. Construct the path based on what you need; the Bitbucket REST API follows predictable resource patterns.

**Parameters:**
- \`path\` (required): API path starting with "/". The "/2.0" prefix is added automatically if omitted.
- \`queryParams\` (optional): Key-value pairs for query string (pagination, filtering, sorting, field selection).
- \`jq\` (optional): JMESPath expression to filter/reshape the JSON response.

**Path patterns:** Bitbucket paths follow REST conventions—\`/repositories/{workspace}/{repo}\` for repo details, append \`/pullrequests\`, \`/commits\`, \`/refs/branches\`, \`/src/{ref}/{filepath}\`, \`/diff/{spec}\`, \`/diffstat/{spec}\` etc. When unsure, consult Bitbucket REST docs or search the web for the specific endpoint.

**Filtering & pagination:** Use \`queryParams\` for \`pagelen\`, \`page\`, \`q\` (filter), \`sort\`, and \`fields\` (partial response). Use \`jq\` to extract specific fields from the response (e.g., \`"values[*].name"\` to list names, or \`"{count:size,repos:values[*].slug}"\` to reshape).

Docs: https://developer.atlassian.com/cloud/bitbucket/rest/`,
		GetApiToolArgs.shape,
		get,
	);

	registerLogger.debug('Successfully registered API tools');
}

export default { registerTools };
