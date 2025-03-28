import { PaginationOptions, EntityIdentifier } from '../types/common.types.js';

/**
 * Pull request identifier for retrieving specific pull requests
 */
export interface PullRequestIdentifier extends EntityIdentifier {
	/**
	 * The workspace slug
	 */
	workspaceSlug: string;

	/**
	 * The repository slug
	 */
	repoSlug: string;

	/**
	 * The pull request ID
	 */
	prId: string;
}

/**
 * Options for listing Bitbucket pull requests
 */
export interface ListPullRequestsOptions extends PaginationOptions {
	/**
	 * The workspace slug to list pull requests for
	 */
	workspaceSlug: string;

	/**
	 * The repository slug to list pull requests for
	 */
	repoSlug: string;

	/**
	 * Filter by pull request state
	 */
	state?: 'OPEN' | 'MERGED' | 'DECLINED' | 'SUPERSEDED';

	/**
	 * Filter string to search for in pull request title, description, or author
	 */
	query?: string;

	/**
	 * Optional field to sort by (e.g., '-created_on', 'updated_on')
	 */
	sort?: string;
}

/**
 * Options for listing comments on a pull request
 */
export interface ListPullRequestCommentsOptions extends PaginationOptions {
	/**
	 * The workspace slug
	 */
	workspaceSlug: string;

	/**
	 * The repository slug
	 */
	repoSlug: string;

	/**
	 * The pull request ID
	 */
	prId: string;

	/**
	 * Optional field to sort by (e.g., '-created_on', 'updated_on')
	 */
	sort?: string;
}

/**
 * Options for adding a comment to a pull request
 */
export interface AddPullRequestCommentOptions {
	/**
	 * The workspace slug
	 */
	workspaceSlug: string;

	/**
	 * The repository slug
	 */
	repoSlug: string;

	/**
	 * The pull request ID
	 */
	prId: string;

	/**
	 * The content of the comment
	 */
	content: string;

	/**
	 * Optional inline comment location
	 */
	inline?: {
		/**
		 * File path for the inline comment
		 */
		path: string;

		/**
		 * Line number for the inline comment
		 */
		line: number;
	};
}
