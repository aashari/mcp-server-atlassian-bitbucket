import { createAuthMissingError } from '../utils/error.util.js';
import { Logger } from '../utils/logger.util.js';
import {
	fetchAtlassian,
	getAtlassianCredentials,
} from '../utils/transport.util.js';
import {
	Issue,
	IssueListResponse,
	IssueComment,
	CommentListResponse,
	ListIssuesParams,
	GetIssueParams,
	CreateIssueParams,
	UpdateIssueParams,
	DeleteIssueParams,
	ListCommentsParams,
	AddCommentParams,
} from './vendor.atlassian.issues.types.js';

/**
 * Base API path for Bitbucket REST API v2
 * @see https://developer.atlassian.com/cloud/bitbucket/rest/api-group-issue-tracker/
 * @constant {string}
 */
const API_PATH = '/2.0';

/**
 * @namespace VendorAtlassianIssuesService
 * @description Service for interacting with Bitbucket Issues API.
 * Provides methods for managing issues and comments in Bitbucket repositories.
 * All methods require valid Atlassian credentials configured in the environment.
 */

// Create a contextualized logger for this file
const serviceLogger = Logger.forContext(
	'services/vendor.atlassian.issues.service.ts',
);

// Log service initialization
serviceLogger.debug('Bitbucket issues service initialized');

/**
 * List issues for a repository
 * @param {ListIssuesParams} params - Parameters for the request
 * @param {string} params.workspace - The workspace slug or UUID
 * @param {string} params.repo_slug - The repository slug or UUID
 * @param {string} [params.status] - Filter by issue status
 * @param {string} [params.kind] - Filter by issue kind (bug, enhancement, proposal, task)
 * @param {string} [params.priority] - Filter by priority level
 * @param {string} [params.q] - BBQL (Bitbucket Query Language) filter expression (e.g., 'title ~ "login" AND state="open"', 'priority>="major"')
 * @param {string} [params.sort] - Property to sort by (e.g., 'created_on', '-updated_on')
 * @param {number} [params.page] - Page number for pagination
 * @param {number} [params.pagelen] - Number of items per page
 * @returns {Promise<IssueListResponse>} Response containing issues
 * @example
 * ```typescript
 * // List open bugs in a repository, sorted by creation date
 * const response = await list({
 *   workspace: 'myworkspace',
 *   repo_slug: 'myrepo',
 *   status: 'open',
 *   kind: 'bug',
 *   sort: '-created_on',
 *   pagelen: 25
 * });
 * ```
 */
async function list(params: ListIssuesParams): Promise<IssueListResponse> {
	const methodLogger = Logger.forContext(
		'services/vendor.atlassian.issues.service.ts',
		'list',
	);
	methodLogger.debug('Listing Bitbucket issues with params:', params);

	if (!params.workspace || !params.repo_slug) {
		throw new Error('Both workspace and repo_slug parameters are required');
	}

	const credentials = getAtlassianCredentials();
	if (!credentials) {
		throw createAuthMissingError(
			'Atlassian credentials are required for this operation',
		);
	}

	// Construct query parameters
	const queryParams = new URLSearchParams();

	// Add optional filter parameters
	if (params.status) {
		queryParams.set('status', params.status);
	}
	if (params.kind) {
		queryParams.set('kind', params.kind);
	}
	if (params.priority) {
		queryParams.set('priority', params.priority);
	}
	if (params.q) {
		queryParams.set('q', params.q);
	}
	if (params.sort) {
		queryParams.set('sort', params.sort);
	}
	if (params.pagelen) {
		queryParams.set('pagelen', params.pagelen.toString());
	}
	if (params.page) {
		queryParams.set('page', params.page.toString());
	}

	const queryString = queryParams.toString()
		? `?${queryParams.toString()}`
		: '';
	const path = `${API_PATH}/repositories/${params.workspace}/${params.repo_slug}/issues${queryString}`;

	methodLogger.debug(`Sending request to: ${path}`);
	return fetchAtlassian<IssueListResponse>(credentials, path);
}

/**
 * Get detailed information about a specific Bitbucket issue
 *
 * Retrieves comprehensive details about a single issue.
 *
 * @async
 * @memberof VendorAtlassianIssuesService
 * @param {GetIssueParams} params - Parameters for the request
 * @param {string} params.workspace - The workspace slug or UUID
 * @param {string} params.repo_slug - The repository slug or UUID
 * @param {number} params.issue_id - The ID of the issue
 * @returns {Promise<Issue>} Promise containing the detailed issue information
 * @throws {Error} If Atlassian credentials are missing or API request fails
 * @example
 * // Get issue details
 * const issue = await get({
 *   workspace: 'my-workspace',
 *   repo_slug: 'my-repo',
 *   issue_id: 123
 * });
 */
async function get(params: GetIssueParams): Promise<Issue> {
	const methodLogger = Logger.forContext(
		'services/vendor.atlassian.issues.service.ts',
		'get',
	);
	methodLogger.debug('Getting Bitbucket issue details with params:', params);

	if (!params.workspace || !params.repo_slug || !params.issue_id) {
		throw new Error(
			'workspace, repo_slug, and issue_id parameters are required',
		);
	}

	const credentials = getAtlassianCredentials();
	if (!credentials) {
		throw createAuthMissingError(
			'Atlassian credentials are required for this operation',
		);
	}

	const path = `${API_PATH}/repositories/${params.workspace}/${params.repo_slug}/issues/${params.issue_id}`;

	methodLogger.debug(`Sending request to: ${path}`);
	return fetchAtlassian<Issue>(credentials, path);
}

/**
 * Create a new issue in a repository
 *
 * Creates a new issue with the specified title and optional content.
 *
 * @async
 * @memberof VendorAtlassianIssuesService
 * @param {CreateIssueParams} params - Parameters for creating the issue
 * @param {string} params.workspace - The workspace slug or UUID
 * @param {string} params.repo_slug - The repository slug or UUID
 * @param {string} params.title - The issue title
 * @param {string} [params.content] - The issue description in markdown
 * @param {string} [params.kind] - The issue kind (bug, enhancement, proposal, task)
 * @param {string} [params.priority] - The issue priority (trivial, minor, major, critical, blocker)
 * @returns {Promise<Issue>} Promise containing the created issue
 * @throws {Error} If Atlassian credentials are missing or API request fails
 * @example
 * // Create a new bug issue
 * const issue = await create({
 *   workspace: 'my-workspace',
 *   repo_slug: 'my-repo',
 *   title: 'Fix login button',
 *   content: 'The login button is not working properly',
 *   kind: 'bug',
 *   priority: 'major'
 * });
 */
async function create(params: CreateIssueParams): Promise<Issue> {
	const methodLogger = Logger.forContext(
		'services/vendor.atlassian.issues.service.ts',
		'create',
	);
	methodLogger.debug('Creating Bitbucket issue with params:', params);

	if (!params.workspace || !params.repo_slug || !params.title) {
		throw new Error(
			'workspace, repo_slug, and title parameters are required',
		);
	}

	const credentials = getAtlassianCredentials();
	if (!credentials) {
		throw createAuthMissingError(
			'Atlassian credentials are required for this operation',
		);
	}

	// Build request body
	const body: Record<string, unknown> = {
		title: params.title,
	};

	if (params.content) {
		body.content = {
			raw: params.content,
			markup: 'markdown',
		};
	}

	if (params.kind) {
		body.kind = params.kind;
	}

	if (params.priority) {
		body.priority = params.priority;
	}

	const path = `${API_PATH}/repositories/${params.workspace}/${params.repo_slug}/issues`;

	methodLogger.debug(`Sending POST request to: ${path}`);
	return fetchAtlassian<Issue>(credentials, path, {
		method: 'POST',
		body,
	});
}

/**
 * Update an existing issue
 *
 * Updates one or more fields of an existing issue.
 *
 * @async
 * @memberof VendorAtlassianIssuesService
 * @param {UpdateIssueParams} params - Parameters for updating the issue
 * @param {string} params.workspace - The workspace slug or UUID
 * @param {string} params.repo_slug - The repository slug or UUID
 * @param {number} params.issue_id - The ID of the issue to update
 * @param {string} [params.title] - New issue title
 * @param {string} [params.content] - New issue description
 * @param {string} [params.status] - New issue status
 * @param {string} [params.kind] - New issue kind
 * @param {string} [params.priority] - New issue priority
 * @param {string} [params.assignee] - UUID of user to assign
 * @returns {Promise<Issue>} Promise containing the updated issue
 * @throws {Error} If Atlassian credentials are missing or API request fails
 * @example
 * // Update an issue status and priority
 * const issue = await update({
 *   workspace: 'my-workspace',
 *   repo_slug: 'my-repo',
 *   issue_id: 123,
 *   status: 'resolved',
 *   priority: 'minor'
 * });
 */
async function update(params: UpdateIssueParams): Promise<Issue> {
	const methodLogger = Logger.forContext(
		'services/vendor.atlassian.issues.service.ts',
		'update',
	);
	methodLogger.debug('Updating Bitbucket issue with params:', params);

	if (!params.workspace || !params.repo_slug || !params.issue_id) {
		throw new Error(
			'workspace, repo_slug, and issue_id parameters are required',
		);
	}

	const credentials = getAtlassianCredentials();
	if (!credentials) {
		throw createAuthMissingError(
			'Atlassian credentials are required for this operation',
		);
	}

	// Build request body with only provided fields
	const body: Record<string, unknown> = {};

	if (params.title !== undefined) {
		body.title = params.title;
	}

	if (params.content !== undefined) {
		body.content = {
			raw: params.content,
			markup: 'markdown',
		};
	}

	if (params.status !== undefined) {
		body.state = params.status;
	}

	if (params.kind !== undefined) {
		body.kind = params.kind;
	}

	if (params.priority !== undefined) {
		body.priority = params.priority;
	}

	if (params.assignee !== undefined) {
		body.assignee = {
			uuid: params.assignee,
		};
	}

	const path = `${API_PATH}/repositories/${params.workspace}/${params.repo_slug}/issues/${params.issue_id}`;

	methodLogger.debug(`Sending PUT request to: ${path}`);
	return fetchAtlassian<Issue>(credentials, path, {
		method: 'PUT',
		body,
	});
}

/**
 * Delete an issue from a repository
 *
 * Permanently deletes the specified issue.
 *
 * @async
 * @memberof VendorAtlassianIssuesService
 * @param {DeleteIssueParams} params - Parameters for deleting the issue
 * @param {string} params.workspace - The workspace slug or UUID
 * @param {string} params.repo_slug - The repository slug or UUID
 * @param {number} params.issue_id - The ID of the issue to delete
 * @returns {Promise<void>} Promise that resolves when issue is deleted
 * @throws {Error} If Atlassian credentials are missing or API request fails
 * @example
 * // Delete an issue
 * await remove({
 *   workspace: 'my-workspace',
 *   repo_slug: 'my-repo',
 *   issue_id: 123
 * });
 */
async function remove(params: DeleteIssueParams): Promise<void> {
	const methodLogger = Logger.forContext(
		'services/vendor.atlassian.issues.service.ts',
		'remove',
	);
	methodLogger.debug('Deleting Bitbucket issue with params:', params);

	if (!params.workspace || !params.repo_slug || !params.issue_id) {
		throw new Error(
			'workspace, repo_slug, and issue_id parameters are required',
		);
	}

	const credentials = getAtlassianCredentials();
	if (!credentials) {
		throw createAuthMissingError(
			'Atlassian credentials are required for this operation',
		);
	}

	const path = `${API_PATH}/repositories/${params.workspace}/${params.repo_slug}/issues/${params.issue_id}`;

	methodLogger.debug(`Sending DELETE request to: ${path}`);
	await fetchAtlassian<void>(credentials, path, {
		method: 'DELETE',
	});
}

/**
 * List comments on an issue
 *
 * Retrieves all comments for a specific issue.
 *
 * @async
 * @memberof VendorAtlassianIssuesService
 * @param {ListCommentsParams} params - Parameters for the request
 * @param {string} params.workspace - The workspace slug or UUID
 * @param {string} params.repo_slug - The repository slug or UUID
 * @param {number} params.issue_id - The ID of the issue
 * @param {number} [params.pagelen] - Number of items per page
 * @param {number} [params.page] - Page number for pagination
 * @returns {Promise<CommentListResponse>} Promise containing the comments
 * @throws {Error} If Atlassian credentials are missing or API request fails
 * @example
 * // List comments on an issue
 * const comments = await listComments({
 *   workspace: 'my-workspace',
 *   repo_slug: 'my-repo',
 *   issue_id: 123,
 *   pagelen: 50
 * });
 */
async function listComments(
	params: ListCommentsParams,
): Promise<CommentListResponse> {
	const methodLogger = Logger.forContext(
		'services/vendor.atlassian.issues.service.ts',
		'listComments',
	);
	methodLogger.debug('Listing issue comments with params:', params);

	if (!params.workspace || !params.repo_slug || !params.issue_id) {
		throw new Error(
			'workspace, repo_slug, and issue_id parameters are required',
		);
	}

	const credentials = getAtlassianCredentials();
	if (!credentials) {
		throw createAuthMissingError(
			'Atlassian credentials are required for this operation',
		);
	}

	// Construct query parameters
	const queryParams = new URLSearchParams();

	if (params.pagelen) {
		queryParams.set('pagelen', params.pagelen.toString());
	}
	if (params.page) {
		queryParams.set('page', params.page.toString());
	}

	const queryString = queryParams.toString()
		? `?${queryParams.toString()}`
		: '';
	const path = `${API_PATH}/repositories/${params.workspace}/${params.repo_slug}/issues/${params.issue_id}/comments${queryString}`;

	methodLogger.debug(`Sending request to: ${path}`);
	return fetchAtlassian<CommentListResponse>(credentials, path);
}

/**
 * Add a comment to an issue
 *
 * Creates a new comment on the specified issue.
 *
 * @async
 * @memberof VendorAtlassianIssuesService
 * @param {AddCommentParams} params - Parameters for adding the comment
 * @param {string} params.workspace - The workspace slug or UUID
 * @param {string} params.repo_slug - The repository slug or UUID
 * @param {number} params.issue_id - The ID of the issue
 * @param {string} params.content - The comment content in markdown
 * @returns {Promise<IssueComment>} Promise containing the created comment
 * @throws {Error} If Atlassian credentials are missing or API request fails
 * @example
 * // Add a comment to an issue
 * const comment = await addComment({
 *   workspace: 'my-workspace',
 *   repo_slug: 'my-repo',
 *   issue_id: 123,
 *   content: 'This is a comment'
 * });
 */
async function addComment(params: AddCommentParams): Promise<IssueComment> {
	const methodLogger = Logger.forContext(
		'services/vendor.atlassian.issues.service.ts',
		'addComment',
	);
	methodLogger.debug('Adding comment to issue with params:', params);

	if (
		!params.workspace ||
		!params.repo_slug ||
		!params.issue_id ||
		!params.content
	) {
		throw new Error(
			'workspace, repo_slug, issue_id, and content parameters are required',
		);
	}

	const credentials = getAtlassianCredentials();
	if (!credentials) {
		throw createAuthMissingError(
			'Atlassian credentials are required for this operation',
		);
	}

	// Build request body
	const body = {
		content: {
			raw: params.content,
			markup: 'markdown',
		},
	};

	const path = `${API_PATH}/repositories/${params.workspace}/${params.repo_slug}/issues/${params.issue_id}/comments`;

	methodLogger.debug(`Sending POST request to: ${path}`);
	return fetchAtlassian<IssueComment>(credentials, path, {
		method: 'POST',
		body,
	});
}

export default { list, get, create, update, remove, listComments, addComment };
