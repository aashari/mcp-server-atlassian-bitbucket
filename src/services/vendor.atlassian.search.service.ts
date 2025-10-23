import { fetchAtlassian } from '../utils/transport.util.js';
import { Logger } from '../utils/logger.util.js';
import { NETWORK_TIMEOUTS } from '../utils/constants.util.js';
import { URLSearchParams } from 'url';
import { getAtlassianCredentials } from '../utils/transport.util.js';
import {
	ContentSearchParams,
	ContentSearchResponse,
} from './vendor.atlassian.search.types.js';

const logger = Logger.forContext('services/vendor.atlassian.search.service.ts');

/**
 * Search options for code search in a workspace
 */
export interface SearchCodeParams {
	workspaceSlug: string;
	searchQuery: string;
	page?: number;
	pageLen?: number;
	repoSlug?: string;
	fields?: string;
	language?: string;
	extension?: string;
}

/**
 * Search options for commit search in a repository
 */
export interface SearchCommitsParams {
	workspaceSlug: string;
	repoSlug: string;
	searchQuery: string;
	page?: number;
	pageLen?: number;
	fields?: string;
}

/**
 * Response type for code search API
 */
export interface CodeSearchResponse {
	size: number;
	page: number;
	pagelen: number;
	query_substituted: boolean;
	values: CodeSearchResult[];
}

/**
 * Response type for commits API
 */
export interface CommitsResponse {
	size: number;
	page: number;
	pagelen: number;
	next?: string;
	previous?: string;
	values: CommitResult[];
}

/**
 * Commit result type
 */
export interface CommitResult {
	hash: string;
	date: string;
	message: string;
	type: string;
	author: {
		raw: string;
		type: string;
		user?: {
			display_name: string;
			account_id: string;
			links: {
				self: { href: string };
				avatar: { href: string };
			};
		};
	};
	links: {
		self: { href: string };
		html: { href: string };
	};
	repository?: {
		name: string;
		full_name: string;
		links: {
			self: { href: string };
			html: { href: string };
		};
	};
}

/**
 * Code search result type
 */
export interface CodeSearchResult {
	type: string;
	content_match_count: number;
	content_matches: ContentMatch[];
	path_matches: PathMatch[];
	file: {
		path: string;
		type: string;
		links: {
			self: {
				href: string;
			};
		};
	};
}

/**
 * Content match type
 */
export interface ContentMatch {
	lines: {
		line: number;
		segments: {
			text: string;
			match?: boolean;
		}[];
	}[];
}

/**
 * Path match type
 */
export interface PathMatch {
	text: string;
	match?: boolean;
}

/**
 * Search for commits in a repository using the Bitbucket API
 *
 * @param {SearchCommitsParams} params - Parameters for the commit search
 * @returns {Promise<CommitsResponse>} The search results from the Bitbucket API
 */
export async function searchCommits(
	params: SearchCommitsParams,
): Promise<CommitsResponse> {
	// Build the query parameters - the Bitbucket API allows searching commits by message
	const queryParams = new URLSearchParams();

	// If search query is provided, add it as a q parameter
	if (params.searchQuery) {
		queryParams.append('q', `message ~ "${params.searchQuery}"`);
	}

	// Add optional pagination parameters
	if (params.page) {
		queryParams.append('page', params.page.toString());
	}

	if (params.pageLen) {
		queryParams.append('pagelen', params.pageLen.toString());
	}

	// Add optional fields parameter for enhanced responses
	if (params.fields) {
		queryParams.append('fields', params.fields);
	}

	// Get credentials for API call
	const credentials = getAtlassianCredentials();
	if (!credentials) {
		throw new Error('No Atlassian credentials available');
	}

	// Don't override useBitbucketAuth - let the credentials determine the auth method

	// Create API path for Bitbucket commits
	const path = `/2.0/repositories/${params.workspaceSlug}/${params.repoSlug}/commits${
		queryParams.toString() ? '?' + queryParams.toString() : ''
	}`;

	// Track searching commits in repository
	logger.debug(
		`Searching commits in repository: ${params.workspaceSlug}/${params.repoSlug}`,
		{
			searchQuery: params.searchQuery,
			path,
		},
	);

	// Call Bitbucket API with credentials and path
	return fetchAtlassian(credentials, path, {
		timeout: NETWORK_TIMEOUTS.SEARCH_REQUEST_TIMEOUT,
	});
}

/**
 * Search for code in a workspace using the Bitbucket API
 *
 * @param {SearchCodeParams} params - Parameters for the code search
 * @returns {Promise<CodeSearchResponse>} The search results from the Bitbucket API
 */
export async function searchCode(
	params: SearchCodeParams,
): Promise<CodeSearchResponse> {
	// If repoSlug is provided, enhance the search query with repo: syntax
	const searchQuery = params.repoSlug
		? `${params.searchQuery} repo:${params.repoSlug}`
		: params.searchQuery;

	// Language mapping to handle common alternative names
	const languageMapping: Record<string, string> = {
		hcl: 'terraform',
		tf: 'terraform',
		typescript: 'ts',
		javascript: 'js',
		python: 'py',
		// Add more mappings as needed
	};

	// Append language and extension filters if provided
	let finalSearchQuery = searchQuery;
	if (params.language) {
		// Use the mapped language name if available, otherwise use the original
		const mappedLanguage = params.language.toLowerCase();
		const apiLanguage = languageMapping[mappedLanguage] || mappedLanguage;

		logger.debug(
			`Language mapping: "${mappedLanguage}" -> "${apiLanguage}"`,
		);
		finalSearchQuery += ` lang:${apiLanguage}`;
	}
	if (params.extension) {
		finalSearchQuery += ` ext:${params.extension}`;
	}

	// Build the query parameters
	const queryParams = new URLSearchParams({
		search_query: finalSearchQuery,
	});

	// Add optional pagination parameters
	if (params.page) {
		queryParams.append('page', params.page.toString());
	}

	if (params.pageLen) {
		queryParams.append('pagelen', params.pageLen.toString());
	}

	// Add optional fields parameter for enhanced responses
	if (params.fields) {
		queryParams.append('fields', params.fields);
	}

	// Get credentials for API call
	const credentials = getAtlassianCredentials();
	if (!credentials) {
		throw new Error('No Atlassian credentials available');
	}

	// Don't override useBitbucketAuth - let the credentials determine the auth method

	// Create API path for Bitbucket code search
	const path = `/2.0/workspaces/${params.workspaceSlug}/search/code?${queryParams.toString()}`;

	// Track searching code in workspace
	logger.debug(`Searching code in workspace: ${params.workspaceSlug}`, {
		searchQuery: finalSearchQuery,
		path,
	});

	// Call Bitbucket API with credentials and path
	return fetchAtlassian(credentials, path, {
		timeout: NETWORK_TIMEOUTS.SEARCH_REQUEST_TIMEOUT,
	});
}

/**
 * Search for content in Bitbucket
 *
 * @param params Search parameters
 * @returns Content search response
 */
async function searchContent(
	params: ContentSearchParams,
): Promise<ContentSearchResponse> {
	const logger = Logger.forContext(
		'services/vendor.atlassian.search.service.ts',
		'searchContent',
	);

	try {
		const credentials = getAtlassianCredentials();
		if (!credentials) {
			throw new Error(
				'Atlassian credentials are required for content search',
			);
		}

		// Build query parameters
		const queryParams = new URLSearchParams();

		// Format the query
		queryParams.set('q', params.query);

		// Add pagination parameters
		queryParams.set('pagelen', String(params.limit || 25));
		queryParams.set('page', String(params.page || 1));

		// Add content type filter if specified
		if (params.contentType) {
			queryParams.set('content_type', params.contentType);
		}

		// Construct URL based on whether a repository is specified
		let url = `/2.0/search/${params.workspaceSlug}`;
		if (params.repoSlug) {
			url = `/2.0/search/${params.workspaceSlug}/${params.repoSlug}`;
		}

		// Add query parameters
		url += `?${queryParams.toString()}`;

		logger.debug(`Content search request URL: ${url}`);

		// Make the request
		const response = await fetchAtlassian<ContentSearchResponse>(
			credentials,
			url,
			{
				timeout: NETWORK_TIMEOUTS.SEARCH_REQUEST_TIMEOUT,
			},
		);

		return response;
	} catch (error) {
		logger.error('Content search failed:', error);
		throw error;
	}
}

export default {
	searchCode,
	searchCommits,
	searchContent,
};
