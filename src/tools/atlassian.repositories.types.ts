import { z } from 'zod';

/**
 * Repository tool types.
 *
 * NOTE: ListRepositoriesToolArgs MCP tool has been deprecated.
 * The bb_ls_repos tool has been replaced by the generic bb_get tool.
 * Use: bb_get({ path: "/repositories/{workspace}" })
 *
 * NOTE: ListBranchesToolArgs MCP tool has been deprecated.
 * The bb_list_branches tool has been replaced by the generic bb_get tool.
 * Use: bb_get({ path: "/repositories/{workspace}/{repo_slug}/refs/branches" })
 *
 * These schemas are kept for backwards compatibility with the CLI and controller.
 */

/**
 * Base pagination arguments for all tools
 */
const PaginationArgs = {
	limit: z
		.number()
		.int()
		.positive()
		.max(100)
		.optional()
		.describe(
			'Maximum number of items to return (1-100). Controls the response size. Defaults to 25 if omitted.',
		),

	cursor: z
		.string()
		.optional()
		.describe(
			'Pagination cursor for retrieving the next set of results. Obtained from previous response when more results are available.',
		),
};

/**
 * Schema for list-repositories tool arguments
 */
export const ListRepositoriesToolArgs = z.object({
	/**
	 * Workspace slug containing the repositories
	 */
	workspaceSlug: z
		.string()
		.optional()
		.describe(
			'Workspace slug containing the repositories. If not provided, the system will use your default workspace (either configured via BITBUCKET_DEFAULT_WORKSPACE or the first workspace in your account). Example: "myteam"',
		),

	/**
	 * Optional query to filter repositories
	 */
	query: z
		.string()
		.optional()
		.describe(
			'Query string to filter repositories by name or other properties (text search). Example: "api" for repositories with "api" in the name/description. If omitted, returns all repositories.',
		),

	/**
	 * Optional sort parameter
	 */
	sort: z
		.string()
		.optional()
		.describe(
			'Field to sort results by. Common values: "name", "created_on", "updated_on". Prefix with "-" for descending order. Example: "-updated_on" for most recently updated first.',
		),

	/**
	 * Optional role filter
	 */
	role: z
		.string()
		.optional()
		.describe(
			'Filter repositories by the authenticated user\'s role. Common values: "owner", "admin", "contributor", "member". If omitted, returns repositories of all roles.',
		),

	/**
	 * Optional project key filter
	 */
	projectKey: z
		.string()
		.optional()
		.describe('Filter repositories by project key. Example: "project-api"'),

	/**
	 * Maximum number of repositories to return (default: 25)
	 */
	...PaginationArgs,
});

export type ListRepositoriesToolArgsType = z.infer<
	typeof ListRepositoriesToolArgs
>;

/**
 * Schema for create-branch tool arguments.
 */
export const CreateBranchToolArgsSchema = z.object({
	workspaceSlug: z
		.string()
		.optional()
		.describe(
			'Workspace slug containing the repository. If not provided, the system will use your default workspace (either configured via BITBUCKET_DEFAULT_WORKSPACE or the first workspace in your account). Example: "myteam"',
		),
	repoSlug: z
		.string()
		.min(1, 'Repository slug is required')
		.describe('Repository slug where the branch will be created.'),
	newBranchName: z
		.string()
		.min(1, 'New branch name is required')
		.describe('The name for the new branch.'),
	sourceBranchOrCommit: z
		.string()
		.min(1, 'Source branch or commit is required')
		.describe('The name of the branch or the commit hash to branch from.'),
});

export type CreateBranchToolArgsType = z.infer<
	typeof CreateBranchToolArgsSchema
>;

/**
 * Schema for clone-repository tool arguments.
 */
export const CloneRepositoryToolArgs = z.object({
	workspaceSlug: z
		.string()
		.optional()
		.describe(
			'Bitbucket workspace slug containing the repository. If not provided, the tool will use your default workspace (either configured via BITBUCKET_DEFAULT_WORKSPACE or the first workspace in your account). Example: "myteam"',
		),
	repoSlug: z
		.string()
		.min(1, 'Repository slug is required')
		.describe(
			'Repository name/slug to clone. This is the short name of the repository. Example: "project-api"',
		),
	targetPath: z
		.string()
		.min(1, 'Target path is required')
		.describe(
			'Directory path where the repository will be cloned. IMPORTANT: Absolute paths are strongly recommended (e.g., "/home/user/projects" or "C:\\Users\\name\\projects"). Relative paths will be resolved relative to the server\'s working directory, which may not be what you expect. The repository will be cloned into a subdirectory at targetPath/repoSlug. Make sure you have write permissions to this location.',
		),
});

export type CloneRepositoryToolArgsType = z.infer<
	typeof CloneRepositoryToolArgs
>;

/**
 * Schema for list-branches tool arguments
 */
export const ListBranchesToolArgs = z.object({
	/**
	 * Workspace slug containing the repository
	 */
	workspaceSlug: z
		.string()
		.optional()
		.describe(
			'Workspace slug containing the repository. If not provided, the system will use your default workspace. Example: "myteam"',
		),

	/**
	 * Repository slug to list branches from
	 */
	repoSlug: z
		.string()
		.min(1, 'Repository slug is required')
		.describe(
			'Repository slug to list branches from. Must be a valid repository slug in the specified workspace. Example: "project-api"',
		),

	/**
	 * Optional query to filter branches
	 */
	query: z
		.string()
		.optional()
		.describe(
			'Query string to filter branches by name or other properties (text search).',
		),

	/**
	 * Optional sort parameter
	 */
	sort: z
		.string()
		.optional()
		.describe(
			'Field to sort branches by. Common values: "name" (default), "-name", "target.date". Prefix with "-" for descending order.',
		),

	/**
	 * Maximum number of branches to return (default: 25)
	 */
	...PaginationArgs,
});

export type ListBranchesToolArgsType = z.infer<typeof ListBranchesToolArgs>;
