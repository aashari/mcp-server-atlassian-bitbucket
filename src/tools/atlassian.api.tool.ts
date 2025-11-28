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
		`Generic Bitbucket REST GET. Returns pretty-printed JSON (or JMESPath-filtered JSON) for any endpoint.

**How it works**
- \`path\` must start with "/"; we automatically prefix "/2.0" if you omit it.
- \`queryParams\` accepts key/value pairs and is encoded into the URL.
- \`jq\` applies a JMESPath expression to the response; invalid expressions echo the original data with an _jqError hint.

**Great for**
- Workspaces: \`/workspaces\`, \`/workspaces/{workspace}\`
- Repositories: \`/repositories/{workspace}\`, \`/repositories/{workspace}/{repo_slug}\`
- Pull requests: \`/repositories/{workspace}/{repo_slug}/pullrequests\` (and \`/{id}\`)
- History and branches: \`/repositories/{workspace}/{repo_slug}/commits\`, \`/refs/branches\`
- File content: \`/repositories/{workspace}/{repo_slug}/src/{commit}/{path}\`
- Many more endpoints exist—when unsure which path to use, consult Bitbucket REST docs; if you have web search tools, use them to confirm the right endpoint and parameters.

**Query examples**
- \`{"pagelen":"50","page":"2"}\` to page through lists
- \`{"q":"state=\\"OPEN\\"","sort":"-updated_on"}\` to filter/sort PRs
- \`{"fields":"values.name,values.uuid"}\` to trim payload size

**JMESPath examples**
- \`"values[*].name"\` to list names
- \`"{total:size,items:values[*].{name:name,id:uuid}}"\` to reshape output

Bitbucket REST docs: https://developer.atlassian.com/cloud/bitbucket/rest/intro/. Credentials are required.`,
		GetApiToolArgs.shape,
		get,
	);

	registerLogger.debug('Successfully registered API tools');
}

export default { registerTools };
