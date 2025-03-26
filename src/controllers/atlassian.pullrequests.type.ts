import { PaginationOptions, EntityIdentifier } from '../types/common.types.js';

/**
 * Pull request identifier for retrieving specific pull requests
 */
export interface PullRequestIdentifier extends EntityIdentifier {
	/**
	 * The workspace slug
	 */
	workspace: string;

	/**
	 * The repository slug
	 */
	repoSlug: string;

	/**
	 * The pull request ID
	 */
	pullRequestId: string;
}

/**
 * Options for listing Bitbucket pull requests
 */
export interface ListPullRequestsOptions extends PaginationOptions {
	/**
	 * The workspace slug to list pull requests for
	 */
	workspace: string;

	/**
	 * The repository slug to list pull requests for
	 */
	repoSlug: string;

	/**
	 * Filter by pull request state
	 */
	state?: 'OPEN' | 'MERGED' | 'DECLINED' | 'SUPERSEDED';
}

/**
 * Options for getting pull request details
 */
export interface GetPullRequestOptions {
	/**
	 * Whether to include comments in the response
	 */
	includeComments?: boolean;
}
