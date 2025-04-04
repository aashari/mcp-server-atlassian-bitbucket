import { createAuthMissingError } from '../utils/error.util.js';
import { Logger } from '../utils/logger.util.js';
import {
	fetchAtlassian,
	getAtlassianCredentials,
} from '../utils/transport.util.js';
import {
	PullRequestDetailed,
	PullRequestsResponse,
	ListPullRequestsParams,
	GetPullRequestParams,
	GetPullRequestCommentsParams,
	PullRequestCommentsResponse,
	PullRequestComment,
	AddPullRequestCommentParams,
	CreatePullRequestParams,
	DiffstatResponse,
} from './vendor.atlassian.pullrequests.types.js';

/**
 * Base API path for Bitbucket REST API v2
 * @see https://developer.atlassian.com/cloud/bitbucket/rest/api-group-pullrequests/
 * @constant {string}
 */
const API_PATH = '/2.0';

/**
 * @namespace VendorAtlassianPullRequestsService
 * @description Service for interacting with Bitbucket Pull Requests API.
 * Provides methods for listing pull requests and retrieving pull request details.
 * All methods require valid Atlassian credentials configured in the environment.
 */

// Create a contextualized logger for this file
const serviceLogger = Logger.forContext(
	'services/vendor.atlassian.pullrequests.service.ts',
);

// Log service initialization
serviceLogger.debug('Bitbucket pull requests service initialized');

/**
 * List pull requests for a repository
 * @param {ListPullRequestsParams} params - Parameters for the request
 * @param {string} params.workspace - The workspace slug or UUID
 * @param {string} params.repo_slug - The repository slug or UUID
 * @param {PullRequestState | PullRequestState[]} [params.state] - Filter by pull request state (default: 'OPEN')
 * @param {string} [params.q] - Query string to filter pull requests
 * @param {string} [params.sort] - Property to sort by (e.g., 'created_on', '-updated_on')
 * @param {number} [params.page] - Page number for pagination
 * @param {number} [params.pagelen] - Number of items per page
 * @returns {Promise<PullRequestsResponse>} Response containing pull requests
 * @example
 * ```typescript
 * // List open pull requests in a repository, sorted by creation date
 * const response = await list({
 *   workspace: 'myworkspace',
 *   repo_slug: 'myrepo',
 *   sort: '-created_on',
 *   pagelen: 25
 * });
 * ```
 */
async function list(
	params: ListPullRequestsParams,
): Promise<PullRequestsResponse> {
	const methodLogger = Logger.forContext(
		'services/vendor.atlassian.pullrequests.service.ts',
		'list',
	);
	methodLogger.debug('Listing Bitbucket pull requests with params:', params);

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

	// Add state parameter(s) - default to OPEN if not specified
	if (params.state) {
		if (Array.isArray(params.state)) {
			// For multiple states, repeat the parameter
			params.state.forEach((state) => {
				queryParams.append('state', state);
			});
		} else {
			queryParams.set('state', params.state);
		}
	}

	// Add optional query parameters
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
	const path = `${API_PATH}/repositories/${params.workspace}/${params.repo_slug}/pullrequests${queryString}`;

	methodLogger.debug(`Sending request to: ${path}`);
	return fetchAtlassian<PullRequestsResponse>(credentials, path);
}

/**
 * Get detailed information about a specific Bitbucket pull request
 *
 * Retrieves comprehensive details about a single pull request.
 *
 * @async
 * @memberof VendorAtlassianPullRequestsService
 * @param {GetPullRequestParams} params - Parameters for the request
 * @param {string} params.workspace - The workspace slug or UUID
 * @param {string} params.repo_slug - The repository slug or UUID
 * @param {number} params.pull_request_id - The ID of the pull request
 * @returns {Promise<PullRequestDetailed>} Promise containing the detailed pull request information
 * @throws {Error} If Atlassian credentials are missing or API request fails
 * @example
 * // Get pull request details
 * const pullRequest = await get({
 *   workspace: 'my-workspace',
 *   repo_slug: 'my-repo',
 *   pull_request_id: 123
 * });
 */
async function get(params: GetPullRequestParams): Promise<PullRequestDetailed> {
	const methodLogger = Logger.forContext(
		'services/vendor.atlassian.pullrequests.service.ts',
		'get',
	);
	methodLogger.debug(
		`Getting Bitbucket pull request: ${params.workspace}/${params.repo_slug}/${params.pull_request_id}`,
	);

	if (!params.workspace || !params.repo_slug || !params.pull_request_id) {
		throw new Error(
			'workspace, repo_slug, and pull_request_id parameters are all required',
		);
	}

	const credentials = getAtlassianCredentials();
	if (!credentials) {
		throw createAuthMissingError(
			'Atlassian credentials are required for this operation',
		);
	}

	const path = `${API_PATH}/repositories/${params.workspace}/${params.repo_slug}/pullrequests/${params.pull_request_id}`;

	methodLogger.debug(`Sending request to: ${path}`);
	return fetchAtlassian<PullRequestDetailed>(credentials, path);
}

/**
 * Get comments for a specific Bitbucket pull request
 *
 * Retrieves all comments on a specific pull request, including general comments and
 * inline code review comments. Supports pagination.
 *
 * @async
 * @memberof VendorAtlassianPullRequestsService
 * @param {GetPullRequestCommentsParams} params - Parameters for the request
 * @param {string} params.workspace - The workspace slug or UUID
 * @param {string} params.repo_slug - The repository slug or UUID
 * @param {number} params.pull_request_id - The ID of the pull request
 * @param {number} [params.page] - Page number for pagination
 * @param {number} [params.pagelen] - Number of items per page
 * @returns {Promise<PullRequestCommentsResponse>} Promise containing the pull request comments
 * @throws {Error} If Atlassian credentials are missing or API request fails
 * @example
 * // Get comments for a pull request
 * const comments = await getComments({
 *   workspace: 'my-workspace',
 *   repo_slug: 'my-repo',
 *   pull_request_id: 123,
 *   pagelen: 25
 * });
 */
async function getComments(
	params: GetPullRequestCommentsParams,
): Promise<PullRequestCommentsResponse> {
	const methodLogger = Logger.forContext(
		'services/vendor.atlassian.pullrequests.service.ts',
		'getComments',
	);
	methodLogger.debug(
		`Getting comments for Bitbucket pull request: ${params.workspace}/${params.repo_slug}/${params.pull_request_id}`,
	);

	if (!params.workspace || !params.repo_slug || !params.pull_request_id) {
		throw new Error(
			'workspace, repo_slug, and pull_request_id parameters are all required',
		);
	}

	const credentials = getAtlassianCredentials();
	if (!credentials) {
		throw createAuthMissingError(
			'Atlassian credentials are required for this operation',
		);
	}

	// Build query parameters
	const queryParams = new URLSearchParams();

	// Add pagination parameters if provided
	if (params.pagelen) {
		queryParams.set('pagelen', params.pagelen.toString());
	}
	if (params.page) {
		queryParams.set('page', params.page.toString());
	}
	// Add sort parameter if provided
	if (params.sort) {
		queryParams.set('sort', params.sort);
	}

	const queryString = queryParams.toString()
		? `?${queryParams.toString()}`
		: '';

	const path = `${API_PATH}/repositories/${params.workspace}/${params.repo_slug}/pullrequests/${params.pull_request_id}/comments${queryString}`;

	methodLogger.debug(`Sending request to: ${path}`);
	return fetchAtlassian<PullRequestCommentsResponse>(credentials, path);
}

/**
 * Add a comment to a specific Bitbucket pull request
 *
 * Creates a new comment on a pull request, either as a general comment or
 * as an inline code comment attached to a specific file and line.
 *
 * @async
 * @memberof VendorAtlassianPullRequestsService
 * @param {AddPullRequestCommentParams} params - Parameters for the request
 * @param {string} params.workspace - The workspace slug or UUID
 * @param {string} params.repo_slug - The repository slug or UUID
 * @param {number} params.pull_request_id - The ID of the pull request
 * @param {Object} params.content - The content of the comment
 * @param {string} params.content.raw - The raw text of the comment
 * @param {Object} [params.inline] - Optional inline comment location
 * @param {string} params.inline.path - The file path for the inline comment
 * @param {number} params.inline.to - The line number in the file
 * @returns {Promise<PullRequestComment>} Promise containing the created comment
 * @throws {Error} If Atlassian credentials are missing or API request fails
 * @example
 * // Add a general comment to a pull request
 * const comment = await addComment({
 *   workspace: 'my-workspace',
 *   repo_slug: 'my-repo',
 *   pull_request_id: 123,
 *   content: { raw: "This looks good to me!" }
 * });
 *
 * // Add an inline code comment
 * const comment = await addComment({
 *   workspace: 'my-workspace',
 *   repo_slug: 'my-repo',
 *   pull_request_id: 123,
 *   content: { raw: "Consider using a constant here instead." },
 *   inline: { path: "src/main.js", to: 42 }
 * });
 */
async function addComment(
	params: AddPullRequestCommentParams,
): Promise<PullRequestComment> {
	const methodLogger = Logger.forContext(
		'services/vendor.atlassian.pullrequests.service.ts',
		'addComment',
	);
	methodLogger.debug(
		`Adding comment to Bitbucket pull request: ${params.workspace}/${params.repo_slug}/${params.pull_request_id}`,
	);

	if (!params.workspace || !params.repo_slug || !params.pull_request_id) {
		throw new Error(
			'workspace, repo_slug, and pull_request_id parameters are all required',
		);
	}

	if (!params.content || !params.content.raw) {
		throw new Error('Comment content is required');
	}

	const credentials = getAtlassianCredentials();
	if (!credentials) {
		throw createAuthMissingError(
			'Atlassian credentials are required for this operation',
		);
	}

	const path = `${API_PATH}/repositories/${params.workspace}/${params.repo_slug}/pullrequests/${params.pull_request_id}/comments`;

	methodLogger.debug(`Sending POST request to: ${path}`);
	return fetchAtlassian<PullRequestComment>(credentials, path, {
		method: 'POST',
		body: {
			content: params.content,
			inline: params.inline,
		},
	});
}

/**
 * Create a new pull request
 * @param {CreatePullRequestParams} params - Parameters for the request
 * @param {string} params.workspace - The workspace slug or UUID
 * @param {string} params.repo_slug - The repository slug or UUID
 * @param {string} params.title - Title of the pull request
 * @param {string} params.source.branch.name - Source branch name
 * @param {string} params.destination.branch.name - Destination branch name (defaults to main/master)
 * @param {string} [params.description] - Optional description for the pull request
 * @param {boolean} [params.close_source_branch] - Whether to close the source branch after merge (default: false)
 * @returns {Promise<PullRequestDetailed>} Detailed information about the created pull request
 * @example
 * ```typescript
 * // Create a new pull request
 * const pullRequest = await create({
 *   workspace: 'myworkspace',
 *   repo_slug: 'myrepo',
 *   title: 'Add new feature',
 *   source: {
 *     branch: {
 *       name: 'feature/new-feature'
 *     }
 *   },
 *   destination: {
 *     branch: {
 *       name: 'main'
 *     }
 *   },
 *   description: 'This PR adds a new feature...',
 *   close_source_branch: true
 * });
 * ```
 */
async function create(
	params: CreatePullRequestParams,
): Promise<PullRequestDetailed> {
	const methodLogger = Logger.forContext(
		'services/vendor.atlassian.pullrequests.service.ts',
		'create',
	);
	methodLogger.debug(
		'Creating new Bitbucket pull request with params:',
		params,
	);

	if (!params.workspace || !params.repo_slug) {
		throw new Error('Both workspace and repo_slug parameters are required');
	}

	if (!params.title) {
		throw new Error('Pull request title is required');
	}

	if (!params.source || !params.source.branch || !params.source.branch.name) {
		throw new Error('Source branch name is required');
	}

	// Destination branch is required but may have a default
	if (
		!params.destination ||
		!params.destination.branch ||
		!params.destination.branch.name
	) {
		throw new Error('Destination branch name is required');
	}

	const credentials = getAtlassianCredentials();
	if (!credentials) {
		throw createAuthMissingError(
			'Atlassian credentials are required for this operation',
		);
	}

	const path = `${API_PATH}/repositories/${params.workspace}/${params.repo_slug}/pullrequests`;

	// Construct request body with only the fields needed by the API
	const requestBody = {
		title: params.title,
		source: {
			branch: {
				name: params.source.branch.name,
			},
		},
		destination: {
			branch: {
				name: params.destination.branch.name,
			},
		},
		description: params.description || '',
		close_source_branch: !!params.close_source_branch,
	};

	methodLogger.debug(`Sending POST request to: ${path}`);
	return fetchAtlassian<PullRequestDetailed>(credentials, path, {
		method: 'POST',
		body: requestBody,
	});
}

/**
 * Get raw diff content for a specific Bitbucket pull request
 *
 * Retrieves the raw diff content showing actual code changes in the pull request.
 * The diff is returned in a standard unified diff format.
 *
 * @async
 * @memberof VendorAtlassianPullRequestsService
 * @param {GetPullRequestParams} params - Parameters for the request
 * @param {string} params.workspace - The workspace slug or UUID
 * @param {string} params.repo_slug - The repository slug or UUID
 * @param {number} params.pull_request_id - The ID of the pull request
 * @returns {Promise<string>} Promise containing the raw diff content
 * @throws {Error} If Atlassian credentials are missing or API request fails
 * @example
 * // Get raw diff content for a pull request
 * const diffContent = await getRawDiff({
 *   workspace: 'my-workspace',
 *   repo_slug: 'my-repo',
 *   pull_request_id: 123
 * });
 */
async function getRawDiff(params: GetPullRequestParams): Promise<string> {
	const methodLogger = Logger.forContext(
		'services/vendor.atlassian.pullrequests.service.ts',
		'getRawDiff',
	);
	methodLogger.debug(
		`Getting raw diff for Bitbucket pull request: ${params.workspace}/${params.repo_slug}/${params.pull_request_id}`,
	);

	if (!params.workspace || !params.repo_slug || !params.pull_request_id) {
		throw new Error(
			'workspace, repo_slug, and pull_request_id parameters are all required',
		);
	}

	const credentials = getAtlassianCredentials();
	if (!credentials) {
		throw createAuthMissingError(
			'Atlassian credentials are required for this operation',
		);
	}

	// Use the diff endpoint directly
	const path = `${API_PATH}/repositories/${params.workspace}/${params.repo_slug}/pullrequests/${params.pull_request_id}/diff`;

	methodLogger.debug(`Sending request to: ${path}`);

	// Override the Accept header to get raw diff content instead of JSON
	return fetchAtlassian<string>(credentials, path, {
		headers: {
			Accept: 'text/plain',
			'Content-Type': 'text/plain',
		},
	});
}

/**
 * Get the diffstat information for a pull request
 *
 * Returns summary statistics about the changes in a pull request,
 * including files changed, insertions, and deletions.
 *
 * @async
 * @memberof VendorAtlassianPullRequestsService
 * @param {GetPullRequestParams} params - Parameters for the request
 * @returns {Promise<DiffstatResponse>} Promise containing the diffstat response
 */
async function getDiffstat(
	params: GetPullRequestParams,
): Promise<DiffstatResponse> {
	const methodLogger = Logger.forContext(
		'services/vendor.atlassian.pullrequests.service.ts',
		'getDiffstat',
	);
	methodLogger.debug(
		`Getting diffstat for Bitbucket pull request: ${params.workspace}/${params.repo_slug}/${params.pull_request_id}`,
	);

	if (!params.workspace || !params.repo_slug || !params.pull_request_id) {
		throw new Error(
			'workspace, repo_slug, and pull_request_id parameters are all required',
		);
	}

	const credentials = getAtlassianCredentials();
	if (!credentials) {
		throw createAuthMissingError(
			'Atlassian credentials are required for this operation',
		);
	}

	const path = `${API_PATH}/repositories/${params.workspace}/${params.repo_slug}/pullrequests/${params.pull_request_id}/diffstat`;

	methodLogger.debug(`Sending request to: ${path}`);
	return fetchAtlassian<DiffstatResponse>(credentials, path);
}

export default {
	list,
	get,
	getComments,
	addComment,
	create,
	getRawDiff,
	getDiffstat,
};
