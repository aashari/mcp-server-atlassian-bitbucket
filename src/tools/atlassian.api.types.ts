import { z } from 'zod';

/**
 * Output format options for API responses
 * - toon: Token-Oriented Object Notation (default, more token-efficient for LLMs)
 * - json: Standard JSON format
 */
export const OutputFormat = z
	.enum(['toon', 'json'])
	.optional()
	.describe(
		'Output format: "toon" (default, 30-60% fewer tokens) or "json". TOON is optimized for LLMs with tabular arrays and minimal syntax.',
	);

/**
 * Base schema fields shared by all API tool arguments
 * Contains path, queryParams, jq filter, and outputFormat
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
	 * IMPORTANT: Always use this to reduce response size and token costs
	 */
	jq: z
		.string()
		.optional()
		.describe(
			'JMESPath expression to filter/transform the response. IMPORTANT: Always use this to extract only needed fields and reduce token costs. Examples: "values[*].{name: name, slug: slug}" (extract specific fields), "values[0]" (first result), "values[*].name" (names only). See https://jmespath.org',
		),

	/**
	 * Output format for the response
	 * Defaults to TOON (token-efficient), can be set to JSON if needed
	 */
	outputFormat: OutputFormat,
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
