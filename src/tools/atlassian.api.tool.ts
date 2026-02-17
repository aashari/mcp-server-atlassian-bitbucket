import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Logger } from '../utils/logger.util.js';
import { formatErrorForMcpTool } from '../utils/error.util.js';
import { truncateForAI } from '../utils/formatter.util.js';
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
	handler: (
		options: GetApiToolArgsType,
	) => Promise<{ content: string; rawResponsePath?: string | null }>,
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
						text: truncateForAI(
							result.content,
							result.rawResponsePath,
						),
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
	handler: (
		options: RequestWithBodyArgsType,
	) => Promise<{ content: string; rawResponsePath?: string | null }>,
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
						text: truncateForAI(
							result.content,
							result.rawResponsePath,
						),
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

// Tool descriptions
const BB_GET_DESCRIPTION = `Read any Bitbucket data. Returns TOON format by default (30-60% fewer tokens than JSON).

**IMPORTANT - Cost Optimization:**
- ALWAYS use \`jq\` param to filter response fields. Unfiltered responses are very expensive!
- Use \`pagelen\` query param to restrict result count (e.g., \`pagelen: "5"\`)
- If unsure about available fields, first fetch ONE item with \`pagelen: "1"\` and NO jq filter to explore the schema, then use jq in subsequent calls

**Schema Discovery Pattern:**
1. First call: \`path: "/workspaces", queryParams: {"pagelen": "1"}\` (no jq) - explore available fields
2. Then use: \`jq: "values[*].{slug: slug, name: name, uuid: uuid}"\` - extract only what you need

**Output format:** TOON (default, token-efficient) or JSON (\`outputFormat: "json"\`)

**Common paths:**
- \`/workspaces\` - list workspaces
- \`/repositories/{workspace}\` - list repos in workspace
- \`/repositories/{workspace}/{repo}\` - get repo details
- \`/repositories/{workspace}/{repo}/pullrequests\` - list PRs
- \`/repositories/{workspace}/{repo}/pullrequests/{id}\` - get PR details
- \`/repositories/{workspace}/{repo}/pullrequests/{id}/comments\` - list PR comments
- \`/repositories/{workspace}/{repo}/pullrequests/{id}/diff\` - get PR diff
- \`/repositories/{workspace}/{repo}/refs/branches\` - list branches
- \`/repositories/{workspace}/{repo}/commits\` - list commits
- \`/repositories/{workspace}/{repo}/src/{commit}/{filepath}\` - get file content
- \`/repositories/{workspace}/{repo}/diff/{source}..{destination}\` - compare branches/commits

**Query params:** \`pagelen\` (page size), \`page\` (page number), \`q\` (filter), \`sort\` (order), \`fields\` (sparse response)

**Example filters (q param):** \`state="OPEN"\`, \`source.branch.name="feature"\`, \`title~"bug"\`

**JQ examples:** \`values[*].slug\`, \`values[0]\`, \`values[*].{name: name, uuid: uuid}\`

The \`/2.0\` prefix is added automatically. API reference: https://developer.atlassian.com/cloud/bitbucket/rest/`;

const BB_POST_DESCRIPTION = `Create Bitbucket resources. Returns TOON format by default (token-efficient).

**IMPORTANT - Cost Optimization:**
- Use \`jq\` param to extract only needed fields from response (e.g., \`jq: "{id: id, title: title}"\`)
- Unfiltered responses include all metadata and are expensive!

**Output format:** TOON (default) or JSON (\`outputFormat: "json"\`)

**Common operations:**

1. **Create PR:** \`/repositories/{workspace}/{repo}/pullrequests\`
   body: \`{"title": "...", "source": {"branch": {"name": "feature"}}, "destination": {"branch": {"name": "main"}}}\`

2. **Add PR comment:** \`/repositories/{workspace}/{repo}/pullrequests/{id}/comments\`
   body: \`{"content": {"raw": "Comment text"}}\`

3. **Approve PR:** \`/repositories/{workspace}/{repo}/pullrequests/{id}/approve\`
   body: \`{}\`

4. **Request changes:** \`/repositories/{workspace}/{repo}/pullrequests/{id}/request-changes\`
   body: \`{}\`

5. **Merge PR:** \`/repositories/{workspace}/{repo}/pullrequests/{id}/merge\`
   body: \`{"merge_strategy": "squash"}\` (strategies: merge_commit, squash, fast_forward)

The \`/2.0\` prefix is added automatically. API reference: https://developer.atlassian.com/cloud/bitbucket/rest/`;

const BB_PUT_DESCRIPTION = `Replace Bitbucket resources (full update). Returns TOON format by default.

**IMPORTANT - Cost Optimization:**
- Use \`jq\` param to extract only needed fields from response
- Example: \`jq: "{uuid: uuid, name: name}"\`

**Output format:** TOON (default) or JSON (\`outputFormat: "json"\`)

**Common operations:**

1. **Update repository:** \`/repositories/{workspace}/{repo}\`
   body: \`{"description": "...", "is_private": true, "has_issues": true}\`

2. **Create/update file:** \`/repositories/{workspace}/{repo}/src\`
   Note: Use multipart form data for file uploads (complex - prefer PATCH for metadata)

3. **Update branch restriction:** \`/repositories/{workspace}/{repo}/branch-restrictions/{id}\`
   body: \`{"kind": "push", "pattern": "main", "users": [{"uuid": "..."}]}\`

The \`/2.0\` prefix is added automatically. API reference: https://developer.atlassian.com/cloud/bitbucket/rest/`;

const BB_PATCH_DESCRIPTION = `Partially update Bitbucket resources. Returns TOON format by default.

**IMPORTANT - Cost Optimization:** Use \`jq\` param to filter response fields.

**Output format:** TOON (default) or JSON (\`outputFormat: "json"\`)

**Common operations:**

1. **Update PR title/description:** \`/repositories/{workspace}/{repo}/pullrequests/{id}\`
   body: \`{"title": "New title", "description": "Updated description"}\`

2. **Update PR reviewers:** \`/repositories/{workspace}/{repo}/pullrequests/{id}\`
   body: \`{"reviewers": [{"uuid": "{user-uuid}"}]}\`

3. **Update repository properties:** \`/repositories/{workspace}/{repo}\`
   body: \`{"description": "New description"}\`

4. **Update comment:** \`/repositories/{workspace}/{repo}/pullrequests/{pr_id}/comments/{comment_id}\`
   body: \`{"content": {"raw": "Updated comment"}}\`

The \`/2.0\` prefix is added automatically. API reference: https://developer.atlassian.com/cloud/bitbucket/rest/`;

const BB_DELETE_DESCRIPTION = `Delete Bitbucket resources. Returns TOON format by default.

**Output format:** TOON (default) or JSON (\`outputFormat: "json"\`)

**Common operations:**

1. **Delete branch:** \`/repositories/{workspace}/{repo}/refs/branches/{branch_name}\`
2. **Delete PR comment:** \`/repositories/{workspace}/{repo}/pullrequests/{pr_id}/comments/{comment_id}\`
3. **Decline PR:** \`/repositories/{workspace}/{repo}/pullrequests/{id}/decline\`
4. **Remove PR approval:** \`/repositories/{workspace}/{repo}/pullrequests/{id}/approve\`
5. **Delete repository:** \`/repositories/{workspace}/{repo}\` (caution: irreversible)

Note: Most DELETE endpoints return 204 No Content on success.

The \`/2.0\` prefix is added automatically. API reference: https://developer.atlassian.com/cloud/bitbucket/rest/`;

/**
 * Register generic Bitbucket API tools with the MCP server.
 * Uses the modern registerTool API (SDK v1.22.0+) instead of deprecated tool() method.
 */
function registerTools(server: McpServer) {
	const registerLogger = Logger.forContext(
		'tools/atlassian.api.tool.ts',
		'registerTools',
	);
	registerLogger.debug('Registering API tools...');

	server.registerTool(
		'bb_get',
		{
			title: 'Bitbucket GET Request',
			description: BB_GET_DESCRIPTION,
			inputSchema: GetApiToolArgs,
			annotations: {
				readOnlyHint: true,
				destructiveHint: false,
				idempotentHint: true,
				openWorldHint: true,
			},
		},
		get,
	);

	server.registerTool(
		'bb_post',
		{
			title: 'Bitbucket POST Request',
			description: BB_POST_DESCRIPTION,
			inputSchema: RequestWithBodyArgs,
			annotations: {
				readOnlyHint: false,
				destructiveHint: false,
				idempotentHint: false,
				openWorldHint: true,
			},
		},
		post,
	);

	server.registerTool(
		'bb_put',
		{
			title: 'Bitbucket PUT Request',
			description: BB_PUT_DESCRIPTION,
			inputSchema: RequestWithBodyArgs,
			annotations: {
				readOnlyHint: false,
				destructiveHint: false,
				idempotentHint: true,
				openWorldHint: true,
			},
		},
		put,
	);

	server.registerTool(
		'bb_patch',
		{
			title: 'Bitbucket PATCH Request',
			description: BB_PATCH_DESCRIPTION,
			inputSchema: RequestWithBodyArgs,
			annotations: {
				readOnlyHint: false,
				destructiveHint: false,
				idempotentHint: false,
				openWorldHint: true,
			},
		},
		patch,
	);

	server.registerTool(
		'bb_delete',
		{
			title: 'Bitbucket DELETE Request',
			description: BB_DELETE_DESCRIPTION,
			inputSchema: DeleteApiToolArgs,
			annotations: {
				readOnlyHint: false,
				destructiveHint: true,
				idempotentHint: true,
				openWorldHint: true,
			},
		},
		del,
	);

	registerLogger.debug('Successfully registered API tools');
}

export default { registerTools };
