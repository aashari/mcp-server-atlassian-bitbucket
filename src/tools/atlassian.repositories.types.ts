import { z } from 'zod';
import {
	CommonToolPaginationArgs,
	CommonRepoIdentifierArgs,
} from './common.tool.types.js';

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
	...CommonToolPaginationArgs.shape,
});

export type ListRepositoriesToolArgsType = z.infer<
	typeof ListRepositoriesToolArgs
>;

/**
 * Schema for get-repository tool arguments
 */
export const GetRepositoryToolArgs = CommonRepoIdentifierArgs.extend({});

export type GetRepositoryToolArgsType = z.infer<typeof GetRepositoryToolArgs>;

/**
 * Schema for get-commit-history tool arguments.
 */
export const GetCommitHistoryToolArgs = CommonRepoIdentifierArgs.extend({
	revision: z
		.string()
		.optional()
		.describe(
			'Optional branch name, tag, or commit hash to view history from. If omitted, uses the default branch.',
		),
	path: z
		.string()
		.optional()
		.describe(
			'Optional file path to filter commit history. Only shows commits affecting this file.',
		),
	...CommonToolPaginationArgs.shape, // Includes limit and cursor
});

export type GetCommitHistoryToolArgsType = z.infer<
	typeof GetCommitHistoryToolArgs
>;

/**
 * Schema for create-branch tool arguments.
 */
export const CreateBranchToolArgsSchema = CommonRepoIdentifierArgs.extend({
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
export const CloneRepositoryToolArgs = CommonRepoIdentifierArgs.extend({
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
 * Schema for get-file-content tool arguments.
 */
export const GetFileContentToolArgs = CommonRepoIdentifierArgs.extend({
	filePath: z
		.string()
		.min(1, 'File path is required')
		.describe(
			'Path to the file within the repository. Example: "README.md" or "src/main.js"',
		),
	revision: z
		.string()
		.optional()
		.describe(
			'Optional branch name, tag, or commit hash to retrieve the file from. If omitted, uses the default branch.',
		),
});

export type GetFileContentToolArgsType = z.infer<typeof GetFileContentToolArgs>;

/**
 * Schema for list-branches tool arguments
 */
export const ListBranchesToolArgs = CommonRepoIdentifierArgs.extend({
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
	...CommonToolPaginationArgs.shape,
});

export type ListBranchesToolArgsType = z.infer<typeof ListBranchesToolArgs>;
