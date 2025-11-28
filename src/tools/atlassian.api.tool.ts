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
		`Makes a GET request to any Bitbucket API endpoint. This is a generic tool that gives you full access to the Bitbucket REST API.

**Parameters:**
- \`path\` (required): The API endpoint path. Must start with "/". The "/2.0" prefix is added automatically.
- \`queryParams\` (optional): Query parameters as key-value pairs.
- \`jq\` (optional): JMESPath expression to filter/transform the JSON response.

**Common Endpoints:**
- \`/workspaces\` - List all workspaces
- \`/workspaces/{workspace}\` - Get workspace details
- \`/repositories/{workspace}\` - List repositories in workspace
- \`/repositories/{workspace}/{repo_slug}\` - Get repository details
- \`/repositories/{workspace}/{repo_slug}/pullrequests\` - List pull requests
- \`/repositories/{workspace}/{repo_slug}/pullrequests/{id}\` - Get PR details
- \`/repositories/{workspace}/{repo_slug}/commits\` - Get commit history
- \`/repositories/{workspace}/{repo_slug}/refs/branches\` - List branches
- \`/repositories/{workspace}/{repo_slug}/src/{commit}/{path}\` - Get file content

**Query Parameters Examples:**
- \`{"pagelen": "50"}\` - Set page size
- \`{"page": "2"}\` - Get specific page
- \`{"q": "state=\\"OPEN\\""}\` - Filter by state
- \`{"sort": "-updated_on"}\` - Sort by field (prefix with - for descending)
- \`{"fields": "values.name,values.uuid"}\` - Select specific fields

**JMESPath Examples:**
- \`"values[*].name"\` - Extract names from paginated list
- \`"values[0]"\` - Get first item
- \`"{total: size, items: values[*].{name: name, id: uuid}}"\` - Reshape response

See https://developer.atlassian.com/cloud/bitbucket/rest/intro/ for full API documentation.
Requires Bitbucket credentials.`,
		GetApiToolArgs.shape,
		get,
	);

	registerLogger.debug('Successfully registered API tools');
}

export default { registerTools };
