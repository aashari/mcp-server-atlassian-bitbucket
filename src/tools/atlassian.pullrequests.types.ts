import { z } from 'zod';
import {
	CommonToolPaginationArgs,
	CommonRepoIdentifierArgs,
	CommonPullRequestIdentifierArgs,
} from './common.tool.types.js';

/**
 * Schema for list-pull-requests tool arguments
 */
export const ListPullRequestsToolArgs = CommonRepoIdentifierArgs.extend({
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
	...CommonToolPaginationArgs.shape,
});

export type ListPullRequestsToolArgsType = z.infer<
	typeof ListPullRequestsToolArgs
>;

/**
 * Schema for get-pull-request tool arguments
 */
export const GetPullRequestToolArgs = CommonPullRequestIdentifierArgs.extend({
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
export const ListPullRequestCommentsToolArgs =
	CommonPullRequestIdentifierArgs.extend({
		/**
		 * Pagination parameters
		 */
		...CommonToolPaginationArgs.shape,
	});

export type ListPullRequestCommentsToolArgsType = z.infer<
	typeof ListPullRequestCommentsToolArgs
>;

/**
 * Schema for create-pr-comment tool arguments
 */
export const CreatePullRequestCommentToolArgs =
	CommonPullRequestIdentifierArgs.extend({
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
	});

export type CreatePullRequestCommentToolArgsType = z.infer<
	typeof CreatePullRequestCommentToolArgs
>;

/**
 * Arguments schema for the pull_requests_create tool
 */
export const CreatePullRequestToolArgs = CommonRepoIdentifierArgs.extend({
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
