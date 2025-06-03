import { z } from 'zod';
import { CommonToolPaginationArgs } from './common.tool.types.js';

/**
 * Bitbucket search tool arguments schema base
 */
export const SearchToolArgsBase = z
	.object({
		/**
		 * Workspace slug to search in. Example: "myteam"
		 * This maps to the CLI's "--workspace" parameter.
		 */
		workspaceSlug: z
			.string()
			.optional()
			.describe(
				'Workspace slug to search in. If not provided, the system will use your default workspace. Example: "myteam". Equivalent to --workspace in CLI.',
			),

		/**
		 * Optional: Repository slug to limit search scope. Required for `pullrequests` scope. Example: "project-api"
		 * This maps to the CLI's "--repo" parameter.
		 */
		repoSlug: z
			.string()
			.optional()
			.describe(
				'Optional: Repository slug to limit search scope. Required for `pullrequests` scope. Example: "project-api". Equivalent to --repo in CLI.',
			),

		/**
		 * Search query text. Required. Will match against content based on the selected search scope.
		 * This maps to the CLI's "--query" parameter.
		 */
		query: z
			.string()
			.min(1)
			.describe(
				'Search query text. Required. Will match against content based on the selected search scope. Equivalent to --query in CLI.',
			),

		/**
		 * Search scope: "code", "content", "repositories", "pullrequests". Default: "code"
		 * This maps to the CLI's "--type" parameter.
		 */
		scope: z
			.enum(['code', 'content', 'repositories', 'pullrequests'])
			.optional()
			.default('code')
			.describe(
				'Search scope: "code", "content", "repositories", "pullrequests". Default: "code". Equivalent to --type in CLI.',
			),

		/**
		 * Content type for content search (e.g., "wiki", "issue")
		 * This maps to the CLI's "--content-type" parameter.
		 */
		contentType: z
			.string()
			.optional()
			.describe(
				'Content type for content search (e.g., "wiki", "issue"). Equivalent to --content-type in CLI.',
			),

		/**
		 * Filter code search by language.
		 * This maps to the CLI's "--language" parameter.
		 */
		language: z
			.string()
			.optional()
			.describe(
				'Filter code search by language. Equivalent to --language in CLI.',
			),

		/**
		 * Filter code search by file extension.
		 * This maps to the CLI's "--extension" parameter.
		 */
		extension: z
			.string()
			.optional()
			.describe(
				'Filter code search by file extension. Equivalent to --extension in CLI.',
			),
	})
	.merge(CommonToolPaginationArgs);

/**
 * Bitbucket search tool arguments schema with validation
 */
export const SearchToolArgs = SearchToolArgsBase.superRefine((data, ctx) => {
	// Make repoSlug required when scope is 'pullrequests'
	if (data.scope === 'pullrequests' && !data.repoSlug) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: 'repoSlug is required when scope is "pullrequests"',
			path: ['repoSlug'],
		});
	}
});

// Export both the schema and its shape for use with the MCP server
export const SearchToolArgsSchema = SearchToolArgsBase;

export type SearchToolArgsType = z.infer<typeof SearchToolArgs>;
