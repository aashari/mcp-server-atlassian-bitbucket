import { z } from 'zod';

/**
 * Schema for generic bb_get tool arguments
 * Allows AI to call any Bitbucket GET endpoint directly
 */
export const GetApiToolArgs = z.object({
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
});

export type GetApiToolArgsType = z.infer<typeof GetApiToolArgs>;
