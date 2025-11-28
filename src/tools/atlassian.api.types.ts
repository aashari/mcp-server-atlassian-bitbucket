import { z } from 'zod';

/**
 * Base schema fields shared by all API tool arguments
 * Contains path, queryParams, and jq filter
 */
const BaseApiToolArgs = {
	/**
	 * The API endpoint path (without base URL)
	 * Examples:
	 * - "/workspaces" - list workspaces
	 * - "/workspaces/{workspace}" - get workspace details
	 * - "/repositories/{workspace}/{repo_slug}" - get repository
	 * - "/repositories/{workspace}/{repo_slug}/pullrequests" - list PRs
	 * - "/repositories/{workspace}/{repo_slug}/pullrequests/{pull_request_id}" - get PR
	 * - "/repositories/{workspace}/{repo_slug}/commits" - get commits
	 * - "/repositories/{workspace}/{repo_slug}/src/{commit}/{path}" - get file content
	 */
	path: z
		.string()
		.min(1, 'Path is required')
		.describe(
			'The Bitbucket API endpoint path (without base URL). Must start with "/". Examples: "/workspaces", "/repositories/{workspace}/{repo_slug}", "/repositories/{workspace}/{repo_slug}/pullrequests/{id}"',
		),

	/**
	 * Optional query parameters as key-value pairs
	 */
	queryParams: z
		.record(z.string())
		.optional()
		.describe(
			'Optional query parameters as key-value pairs. Examples: {"pagelen": "25", "page": "2", "q": "state=\\"OPEN\\"", "fields": "values.title,values.state"}',
		),

	/**
	 * Optional JMESPath expression to filter/transform the response
	 */
	jq: z
		.string()
		.optional()
		.describe(
			'JMESPath expression to filter/transform the JSON response. Examples: "values[*].name" (extract names from list), "size" (single field), "{name: name, uuid: uuid}" (reshape object). See https://jmespath.org for syntax.',
		),
};

/**
 * Body field for requests that include a request body (POST, PUT, PATCH)
 */
const bodyField = z
	.record(z.unknown())
	.describe(
		'Request body as a JSON object. Structure depends on the endpoint. Example for PR: {"title": "My PR", "source": {"branch": {"name": "feature"}}}',
	);

/**
 * Schema for bb_get tool arguments (GET requests - no body)
 */
export const GetApiToolArgs = z.object(BaseApiToolArgs);
export type GetApiToolArgsType = z.infer<typeof GetApiToolArgs>;

/**
 * Schema for requests with body (POST, PUT, PATCH)
 */
export const RequestWithBodyArgs = z.object({
	...BaseApiToolArgs,
	body: bodyField,
});
export type RequestWithBodyArgsType = z.infer<typeof RequestWithBodyArgs>;

/**
 * Schema for bb_post tool arguments (POST requests)
 */
export const PostApiToolArgs = RequestWithBodyArgs;
export type PostApiToolArgsType = RequestWithBodyArgsType;

/**
 * Schema for bb_put tool arguments (PUT requests)
 */
export const PutApiToolArgs = RequestWithBodyArgs;
export type PutApiToolArgsType = RequestWithBodyArgsType;

/**
 * Schema for bb_patch tool arguments (PATCH requests)
 */
export const PatchApiToolArgs = RequestWithBodyArgs;
export type PatchApiToolArgsType = RequestWithBodyArgsType;

/**
 * Schema for bb_delete tool arguments (DELETE requests - no body)
 */
export const DeleteApiToolArgs = GetApiToolArgs;
export type DeleteApiToolArgsType = GetApiToolArgsType;
