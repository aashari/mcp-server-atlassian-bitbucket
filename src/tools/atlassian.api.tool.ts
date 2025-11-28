import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Logger } from '../utils/logger.util.js';
import { formatErrorForMcpTool } from '../utils/error.util.js';
import {
	GetApiToolArgs,
	type GetApiToolArgsType,
	RequestWithBodyArgs,
	type RequestWithBodyArgsType,
	DeleteApiToolArgs,
} from './atlassian.api.types.js';
import {
	handleGet,
	handlePost,
	handlePut,
	handlePatch,
	handleDelete,
} from '../controllers/atlassian.api.controller.js';

// Create a contextualized logger for this file
const toolLogger = Logger.forContext('tools/atlassian.api.tool.ts');

// Log tool initialization
toolLogger.debug('Bitbucket API tool initialized');

/**
 * Creates an MCP tool handler for GET/DELETE requests (no body)
 *
 * @param methodName - Name of the HTTP method for logging
 * @param handler - Controller handler function
 * @returns MCP tool handler function
 */
function createReadHandler(
	methodName: string,
	handler: (options: GetApiToolArgsType) => Promise<{ content: string }>,
) {
	return async (args: Record<string, unknown>) => {
		const methodLogger = Logger.forContext(
			'tools/atlassian.api.tool.ts',
			methodName.toLowerCase(),
		);
		methodLogger.debug(`Making ${methodName} request with args:`, args);

		try {
			const result = await handler(args as GetApiToolArgsType);

			methodLogger.debug(
				'Successfully retrieved response from controller',
			);

			return {
				content: [
					{
						type: 'text' as const,
						text: result.content,
					},
				],
			};
		} catch (error) {
			methodLogger.error(`Failed to make ${methodName} request`, error);
			return formatErrorForMcpTool(error);
		}
	};
}

/**
 * Creates an MCP tool handler for POST/PUT/PATCH requests (with body)
 *
 * @param methodName - Name of the HTTP method for logging
 * @param handler - Controller handler function
 * @returns MCP tool handler function
 */
function createWriteHandler(
	methodName: string,
	handler: (options: RequestWithBodyArgsType) => Promise<{ content: string }>,
) {
	return async (args: Record<string, unknown>) => {
		const methodLogger = Logger.forContext(
			'tools/atlassian.api.tool.ts',
			methodName.toLowerCase(),
		);
		methodLogger.debug(`Making ${methodName} request with args:`, {
			path: args.path,
			bodyKeys: args.body ? Object.keys(args.body as object) : [],
		});

		try {
			const result = await handler(args as RequestWithBodyArgsType);

			methodLogger.debug(
				'Successfully received response from controller',
			);

			return {
				content: [
					{
						type: 'text' as const,
						text: result.content,
					},
				],
			};
		} catch (error) {
			methodLogger.error(`Failed to make ${methodName} request`, error);
			return formatErrorForMcpTool(error);
		}
	};
}

// Create tool handlers
const get = createReadHandler('GET', handleGet);
const post = createWriteHandler('POST', handlePost);
const put = createWriteHandler('PUT', handlePut);
const patch = createWriteHandler('PATCH', handlePatch);
const del = createReadHandler('DELETE', handleDelete);

/**
 * Register generic Bitbucket API tools with the MCP server.
 */
function registerTools(server: McpServer) {
	const registerLogger = Logger.forContext(
		'tools/atlassian.api.tool.ts',
		'registerTools',
	);
	registerLogger.debug('Registering API tools...');

	// Register the GET tool
	server.tool(
		'bb_get',
		`Read any Bitbucket data. Returns JSON, optionally filtered with JMESPath (\`jq\` param).

Paths follow REST conventions: \`/workspaces\`, \`/repositories/{workspace}/{repo}\`, then append \`/pullrequests\`, \`/commits\`, \`/refs/branches\`, \`/src/{ref}/{path}\`, \`/diff/{spec}\`, etc.

Use \`queryParams\` for pagination (\`pagelen\`, \`page\`), filtering (\`q\`), sorting (\`sort\`), or partial responses (\`fields\`). The \`/2.0\` prefix is added automatically.

API reference: https://developer.atlassian.com/cloud/bitbucket/rest/`,
		GetApiToolArgs.shape,
		get,
	);

	// Register the POST tool
	server.tool(
		'bb_post',
		`Create Bitbucket resources. Returns JSON, optionally filtered with JMESPath (\`jq\` param).

Common operations: create PRs, add comments, create branches. Body structure varies by endpoint—consult Bitbucket docs for required fields.

The \`/2.0\` prefix is added automatically.

API reference: https://developer.atlassian.com/cloud/bitbucket/rest/`,
		RequestWithBodyArgs.shape,
		post,
	);

	// Register the PUT tool
	server.tool(
		'bb_put',
		`Replace Bitbucket resources. Returns JSON, optionally filtered with JMESPath (\`jq\` param).

Used for full resource replacement. Common operations: update repository settings, replace file content. Body contains the complete new resource state.

The \`/2.0\` prefix is added automatically.

API reference: https://developer.atlassian.com/cloud/bitbucket/rest/`,
		RequestWithBodyArgs.shape,
		put,
	);

	// Register the PATCH tool
	server.tool(
		'bb_patch',
		`Partially update Bitbucket resources. Returns JSON, optionally filtered with JMESPath (\`jq\` param).

Used for partial updates. Common operations: update PR title/description, modify repository properties. Body contains only the fields to update.

The \`/2.0\` prefix is added automatically.

API reference: https://developer.atlassian.com/cloud/bitbucket/rest/`,
		RequestWithBodyArgs.shape,
		patch,
	);

	// Register the DELETE tool
	server.tool(
		'bb_delete',
		`Delete Bitbucket resources. Returns JSON (if any), optionally filtered with JMESPath (\`jq\` param).

Common operations: delete branches, remove comments, decline PRs. Some DELETE endpoints return empty responses.

The \`/2.0\` prefix is added automatically.

API reference: https://developer.atlassian.com/cloud/bitbucket/rest/`,
		DeleteApiToolArgs.shape,
		del,
	);

	registerLogger.debug('Successfully registered API tools');
}

export default { registerTools };
