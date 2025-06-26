/**
 * Types for Atlassian Bitbucket Pull Requests API
 */

import { Repository } from './vendor.atlassian.repositories.types.js';

/**
 * Pull request state
 */
export type PullRequestState = 'OPEN' | 'MERGED' | 'DECLINED' | 'SUPERSEDED';

/**
 * Pull request author or user reference
 */
export interface PullRequestUser {
	type: 'user' | 'team';
	uuid?: string;
	display_name?: string;
	nickname?: string;
	account_id?: string;
	links?: {
		self?: { href: string };
		html?: { href: string };
		avatar?: { href: string };
	};
}

/**
 * Content representation for rendering
 */
export interface ContentRepresentation {
	raw: string;
	markup: string;
	html: string;
}

/**
 * Rendered content fields
 */
export interface RenderedContent {
	title?: ContentRepresentation;
	description?: ContentRepresentation;
	reason?: ContentRepresentation;
}

/**
 * Pull request summary
 */
export interface PullRequestSummary {
	raw: string;
	markup: string;
	html: string;
}

/**
 * Pull request links object
 */
export interface PullRequestLinks {
	self?: { href: string; name?: string };
	html?: { href: string; name?: string };
	commits?: { href: string; name?: string };
	approve?: { href: string; name?: string };
	diff?: { href: string; name?: string };
	diffstat?: { href: string; name?: string };
	comments?: { href: string; name?: string };
	activity?: { href: string; name?: string };
	merge?: { href: string; name?: string };
	decline?: { href: string; name?: string };
}

/**
 * Pull request branch reference
 */
export interface PullRequestBranchRef {
	repository: Partial<Repository>;
	branch: {
		name: string;
		merge_strategies?: string[];
		default_merge_strategy?: string;
	};
	commit?: {
		hash: string;
	};
}

/**
 * Pull request object returned from the API
 */
export interface PullRequest {
	type: 'pullrequest';
	id: number;
	title: string;
	rendered?: RenderedContent;
	summary?: PullRequestSummary;
	state: PullRequestState;
	author: PullRequestUser;
	source: PullRequestBranchRef;
	destination: PullRequestBranchRef;
	merge_commit?: {
		hash: string;
	};
	comment_count?: number;
	task_count?: number;
	close_source_branch?: boolean;
	closed_by?: PullRequestUser;
	reason?: string;
	created_on: string;
	updated_on: string;
	reviewers?: PullRequestUser[];
	participants?: PullRequestUser[];
	links: PullRequestLinks;
}

/**
 * Extended pull request object with optional fields
 * @remarks Currently identical to PullRequest, but allows for future extension
 */
export type PullRequestDetailed = PullRequest;

/**
 * Parameters for listing pull requests
 */
export interface ListPullRequestsParams {
	workspace: string;
	repo_slug: string;
	state?: PullRequestState | PullRequestState[];
	q?: string;
	sort?: string;
	page?: number;
	pagelen?: number;
}

/**
 * Parameters for getting a pull request by ID
 */
export interface GetPullRequestParams {
	workspace: string;
	repo_slug: string;
	pull_request_id: number;
}

/**
 * API response for listing pull requests
 */
export interface PullRequestsResponse {
	pagelen: number;
	page: number;
	size: number;
	next?: string;
	previous?: string;
	values: PullRequest[];
}

/**
 * Parameters for getting pull request comments
 */
export interface GetPullRequestCommentsParams {
	/**
	 * The workspace slug or UUID
	 */
	workspace: string;

	/**
	 * The repository slug or UUID
	 */
	repo_slug: string;

	/**
	 * The pull request ID
	 */
	pull_request_id: number;

	/**
	 * Page number for pagination
	 */
	page?: number;

	/**
	 * Number of items per page
	 */
	pagelen?: number;

	/**
	 * Property to sort by (e.g., 'created_on', '-updated_on')
	 */
	sort?: string;
}

/**
 * Parameters for creating a comment to a pull request
 */
export interface CreatePullRequestCommentParams {
	/**
	 * The workspace slug or UUID
	 */
	workspace: string;

	/**
	 * The repository slug or UUID
	 */
	repo_slug: string;

	/**
	 * The pull request ID
	 */
	pull_request_id: number;

	/**
	 * The content of the comment
	 */
	content: {
		/**
		 * Raw comment text (can contain markdown)
		 */
		raw: string;
	};

	/**
	 * Optional inline comment location
	 */
	inline?: {
		/**
		 * The file path for the inline comment
		 */
		path: string;

		/**
		 * The line number in the file
		 */
		to?: number;
	};

	/**
	 * For threaded comments, ID of the parent comment
	 */
	parent?: {
		id: number;
	};
}

/**
 * Inline comment position information
 */
export interface InlineCommentPosition {
	/**
	 * The file path the comment is on
	 */
	path: string;

	/**
	 * The original file path if renamed/moved
	 */
	from_path?: string;

	/**
	 * Line number in the "from" file
	 */
	from?: number;

	/**
	 * Line number in the "to" file
	 */
	to?: number;
}

/**
 * Pull request comment object
 */
export interface PullRequestComment {
	/**
	 * Comment ID
	 */
	id: number;

	/**
	 * Comment content
	 */
	content: {
		raw: string;
		markup?: string;
		html?: string;
		type?: string;
	};

	/**
	 * User who created the comment
	 */
	user: PullRequestUser;

	/**
	 * When the comment was created
	 */
	created_on: string;

	/**
	 * When the comment was last updated
	 */
	updated_on: string;

	/**
	 * Whether the comment has been deleted
	 */
	deleted?: boolean;

	/**
	 * For inline comments, contains file and line information
	 */
	inline?: InlineCommentPosition;

	/**
	 * For threaded comments, ID of the parent comment
	 */
	parent?: {
		id: number;
	};

	/**
	 * Links related to this comment
	 */
	links?: {
		self?: { href: string };
		html?: { href: string };
		code?: { href: string };
	};

	/**
	 * Type of the object
	 */
	type: 'pullrequest_comment';
}

/**
 * API response for listing pull request comments
 */
export interface PullRequestCommentsResponse {
	/**
	 * Number of items per page
	 */
	pagelen: number;

	/**
	 * Current page number
	 */
	page: number;

	/**
	 * Total number of items
	 */
	size: number;

	/**
	 * URL for the next page, if available
	 */
	next?: string;

	/**
	 * URL for the previous page, if available
	 */
	previous?: string;

	/**
	 * Array of comment objects
	 */
	values: PullRequestComment[];

	/**
	 * Reference to the pull request these comments belong to
	 */
	pullrequest?: {
		id: number;
		title?: string;
	};
}

/**
 * Parameters for creating a pull request
 */
export interface CreatePullRequestParams {
	/**
	 * The workspace slug or UUID
	 */
	workspace: string;

	/**
	 * The repository slug or UUID
	 */
	repo_slug: string;

	/**
	 * Title of the pull request
	 */
	title: string;

	/**
	 * Source branch information
	 */
	source: {
		branch: {
			name: string;
		};
	};

	/**
	 * Destination branch information
	 */
	destination: {
		branch: {
			name: string;
		};
	};

	/**
	 * Optional description for the pull request
	 */
	description?: string;

	/**
	 * Whether to close the source branch after merge
	 */
	close_source_branch?: boolean;
}

/**
 * Diffstat response representing changes in a pull request
 */
export interface DiffstatResponse {
	pagelen?: number;
	values: DiffstatFileChange[];
	page?: number;
	size?: number;
}

/**
 * Individual file change in a diffstat
 */
export interface DiffstatFileChange {
	status: string;
	old?: {
		path: string;
		type?: string;
	};
	new?: {
		path: string;
		type?: string;
	};
	lines_added?: number;
	lines_removed?: number;
}

/**
 * Parameters for updating a pull request
 */
export interface UpdatePullRequestParams {
	/**
	 * The workspace slug or UUID
	 */
	workspace: string;

	/**
	 * The repository slug or UUID
	 */
	repo_slug: string;

	/**
	 * The pull request ID
	 */
	pull_request_id: number;

	/**
	 * Updated title of the pull request
	 */
	title?: string;

	/**
	 * Updated description for the pull request
	 */
	description?: string;
}

/**
 * Parameters for approving a pull request
 */
export interface ApprovePullRequestParams {
	/**
	 * The workspace slug or UUID
	 */
	workspace: string;

	/**
	 * The repository slug or UUID
	 */
	repo_slug: string;

	/**
	 * The pull request ID
	 */
	pull_request_id: number;
}

/**
 * Parameters for requesting changes on a pull request
 */
export interface RejectPullRequestParams {
	/**
	 * The workspace slug or UUID
	 */
	workspace: string;

	/**
	 * The repository slug or UUID
	 */
	repo_slug: string;

	/**
	 * The pull request ID
	 */
	pull_request_id: number;
}

/**
 * Pull request participant representing approval/rejection status
 */
export interface PullRequestParticipant {
	/**
	 * Type of the object
	 */
	type: 'participant';

	/**
	 * User information
	 */
	user: PullRequestUser;

	/**
	 * Participant role
	 */
	role: 'PARTICIPANT' | 'REVIEWER';

	/**
	 * Whether the participant has approved the PR
	 */
	approved: boolean;

	/**
	 * Participant state
	 */
	state: 'approved' | 'changes_requested' | null;

	/**
	 * When the participant last participated
	 */
	participated_on: string;
}
