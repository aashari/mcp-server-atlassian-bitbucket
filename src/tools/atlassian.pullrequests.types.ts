import { z } from 'zod';

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
 * Schema for list-pull-requests tool arguments
 */
export const ListPullRequestsToolArgs = z.object({
	/**
	 * Workspace slug containing the repository
	 */
	workspaceSlug: z
		.string()
		.optional()
		.describe(
			'Workspace slug containing the repository. If not provided, the system will use your default workspace (either configured via BITBUCKET_DEFAULT_WORKSPACE or the first workspace in your account). Example: "myteam"',
		),

	/**
	 * Repository slug containing the pull requests
	 */
	repoSlug: z
		.string()
		.min(1, 'Repository slug is required')
		.describe(
			'Repository slug containing the pull requests. This must be a valid repository in the specified workspace. Example: "project-api"',
		),

	/**
	 * Filter by pull request state
	 */
	state: z
		.enum(['OPEN', 'MERGED', 'DECLINED', 'SUPERSEDED'])
		.optional()
		.describe(
			'Filter pull requests by state. Options: "OPEN" (active PRs), "MERGED" (completed PRs), "DECLINED" (rejected PRs), or "SUPERSEDED" (replaced PRs). If omitted, defaults to showing all states.',
		),

	/**
	 * Filter query for pull requests
	 */
	query: z
		.string()
		.optional()
		.describe(
			'Filter pull requests by title, description, or author (text search). Uses Bitbucket query syntax.',
		),

	/**
	 * Maximum number of pull requests to return (default: 50)
	 */
	...PaginationArgs,
});

export type ListPullRequestsToolArgsType = z.infer<
	typeof ListPullRequestsToolArgs
>;

/**
 * Schema for get-pull-request tool arguments
 */
export const GetPullRequestToolArgs = z.object({
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
	 * Repository slug containing the pull request
	 */
	repoSlug: z
		.string()
		.min(1, 'Repository slug is required')
		.describe(
			'Repository slug containing the pull request. This must be a valid repository in the specified workspace. Example: "project-api"',
		),

	/**
	 * Pull request identifier
	 */
	prId: z
		.string()
		.min(1, 'Pull request ID is required')
		.describe(
			'Numeric ID of the pull request to retrieve as a string. Must be a valid pull request ID in the specified repository. Example: "42"',
		),

	/**
	 * Optional flag to request the full diff
	 */
	includeFullDiff: z
		.boolean()
		.optional()
		.describe(
			'Set to true to retrieve the full diff content instead of just the summary. Default: true (rich output by default)',
		)
		.default(true),

	/**
	 * Optional flag to include comments
	 */
	includeComments: z
		.boolean()
		.optional()
		.describe(
			'Set to true to retrieve comments for the pull request. Default: false. Note: Enabling this may increase response time for pull requests with many comments due to additional API calls.',
		)
		.default(false),
});

export type GetPullRequestToolArgsType = z.infer<typeof GetPullRequestToolArgs>;

/**
 * Schema for list-pr-comments tool arguments
 */
export const ListPullRequestCommentsToolArgs = z.object({
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
	 * Repository slug containing the pull request
	 */
	repoSlug: z
		.string()
		.min(1, 'Repository slug is required')
		.describe(
			'Repository slug containing the pull request. This must be a valid repository in the specified workspace. Example: "project-api"',
		),

	/**
	 * Pull request identifier
	 */
	prId: z
		.string()
		.min(1, 'Pull request ID is required')
		.describe(
			'Numeric ID of the pull request to retrieve comments from as a string. Must be a valid pull request ID in the specified repository. Example: "42"',
		),

	/**
	 * Pagination parameters
	 */
	...PaginationArgs,
});

export type ListPullRequestCommentsToolArgsType = z.infer<
	typeof ListPullRequestCommentsToolArgs
>;

/**
 * Schema for create-pr-comment tool arguments
 */
export const CreatePullRequestCommentToolArgs = z.object({
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
	 * Repository slug containing the pull request
	 */
	repoSlug: z
		.string()
		.min(1, 'Repository slug is required')
		.describe(
			'Repository slug containing the pull request. This must be a valid repository in the specified workspace. Example: "project-api"',
		),

	/**
	 * Pull request identifier
	 */
	prId: z
		.string()
		.min(1, 'Pull request ID is required')
		.describe(
			'Numeric ID of the pull request to add a comment to as a string. Must be a valid pull request ID in the specified repository. Example: "42"',
		),

	/**
	 * Comment content
	 */
	content: z
		.string()
		.min(1, 'Comment content is required')
		.describe(
			'The content of the comment to add to the pull request in Markdown format. Bitbucket Cloud natively accepts Markdown - supports headings, lists, code blocks, links, and other standard Markdown syntax.',
		),

	/**
	 * Optional inline location for the comment
	 */
	inline: z
		.object({
			path: z
				.string()
				.min(1, 'File path is required for inline comments')
				.describe('The file path to add the comment to.'),
			line: z
				.number()
				.int()
				.positive()
				.describe('The line number to add the comment to.'),
		})
		.optional()
		.describe(
			'Optional inline location for the comment. If provided, this will create a comment on a specific line in a file.',
		),

	parentId: z
		.string()
		.optional()
		.describe(
			'The ID of the parent comment to reply to. If not provided, the comment will be a top-level comment.',
		),
});

export type CreatePullRequestCommentToolArgsType = z.infer<
	typeof CreatePullRequestCommentToolArgs
>;

/**
 * Arguments schema for the pull_requests_create tool
 */
export const CreatePullRequestToolArgs = z.object({
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
	 * Repository slug to create the pull request in
	 */
	repoSlug: z
		.string()
		.min(1, 'Repository slug is required')
		.describe(
			'Repository slug to create the pull request in. This must be a valid repository in the specified workspace. Example: "project-api"',
		),

	/**
	 * Title of the pull request
	 */
	title: z
		.string()
		.min(1, 'Pull request title is required')
		.describe('Title for the pull request. Example: "Add new feature"'),

	/**
	 * Source branch name
	 */
	sourceBranch: z
		.string()
		.min(1, 'Source branch name is required')
		.describe(
			'Source branch name (the branch containing your changes). Example: "feature/new-login"',
		),

	/**
	 * Destination branch name
	 */
	destinationBranch: z
		.string()
		.optional()
		.describe(
			'Destination branch name (the branch you want to merge into, defaults to main). Example: "develop"',
		),

	/**
	 * Description for the pull request
	 */
	description: z
		.string()
		.optional()
		.describe(
			'Optional description for the pull request in Markdown format. Supports standard Markdown syntax including headings, lists, code blocks, and links.',
		),

	/**
	 * Whether to close the source branch after merge
	 */
	closeSourceBranch: z
		.boolean()
		.optional()
		.describe(
			'Whether to close the source branch after the pull request is merged. Default: false',
		),
});

export type CreatePullRequestToolArgsType = z.infer<
	typeof CreatePullRequestToolArgs
>;

/**
 * Schema for update-pull-request tool arguments
 */
export const UpdatePullRequestToolArgs = z.object({
	/**
	 * Workspace slug containing the repository
	 */
	workspaceSlug: z
		.string()
		.optional()
		.describe(
			'Workspace slug containing the repository. If not provided, the system will use your default workspace (either configured via BITBUCKET_DEFAULT_WORKSPACE or the first workspace in your account). Example: "myteam"',
		),

	/**
	 * Repository slug containing the pull request
	 */
	repoSlug: z
		.string()
		.min(1, 'Repository slug is required')
		.describe(
			'Repository slug containing the pull request. This must be a valid repository in the specified workspace. Example: "project-api"',
		),

	/**
	 * Pull request ID
	 */
	pullRequestId: z
		.number()
		.int()
		.positive()
		.describe('Pull request ID to update. Example: 123'),

	/**
	 * Updated title for the pull request
	 */
	title: z
		.string()
		.optional()
		.describe('Updated title for the pull request. Example: "Updated Feature Implementation"'),

	/**
	 * Updated description for the pull request
	 */
	description: z
		.string()
		.optional()
		.describe(
			'Updated description for the pull request in Markdown format. Supports standard Markdown syntax including headings, lists, code blocks, and links.',
		),
});

export type UpdatePullRequestToolArgsType = z.infer<
	typeof UpdatePullRequestToolArgs
>;

/**
 * Schema for approve-pull-request tool arguments
 */
export const ApprovePullRequestToolArgs = z.object({
	/**
	 * Workspace slug containing the repository
	 */
	workspaceSlug: z
		.string()
		.optional()
		.describe(
			'Workspace slug containing the repository. If not provided, the system will use your default workspace (either configured via BITBUCKET_DEFAULT_WORKSPACE or the first workspace in your account). Example: "myteam"',
		),

	/**
	 * Repository slug containing the pull request
	 */
	repoSlug: z
		.string()
		.min(1, 'Repository slug is required')
		.describe(
			'Repository slug containing the pull request. This must be a valid repository in the specified workspace. Example: "project-api"',
		),

	/**
	 * Pull request ID
	 */
	pullRequestId: z
		.number()
		.int()
		.positive()
		.describe('Pull request ID to approve. Example: 123'),
});

export type ApprovePullRequestToolArgsType = z.infer<
	typeof ApprovePullRequestToolArgs
>;

/**
 * Schema for reject-pull-request tool arguments
 */
export const RejectPullRequestToolArgs = z.object({
	/**
	 * Workspace slug containing the repository
	 */
	workspaceSlug: z
		.string()
		.optional()
		.describe(
			'Workspace slug containing the repository. If not provided, the system will use your default workspace (either configured via BITBUCKET_DEFAULT_WORKSPACE or the first workspace in your account). Example: "myteam"',
		),

	/**
	 * Repository slug containing the pull request
	 */
	repoSlug: z
		.string()
		.min(1, 'Repository slug is required')
		.describe(
			'Repository slug containing the pull request. This must be a valid repository in the specified workspace. Example: "project-api"',
		),

	/**
	 * Pull request ID
	 */
	pullRequestId: z
		.number()
		.int()
		.positive()
		.describe('Pull request ID to request changes on. Example: 123'),
});

export type RejectPullRequestToolArgsType = z.infer<
	typeof RejectPullRequestToolArgs
>;
