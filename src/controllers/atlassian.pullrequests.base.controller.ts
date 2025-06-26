import atlassianPullRequestsService from '../services/vendor.atlassian.pullrequests.service.js';
import { Logger } from '../utils/logger.util.js';
import { handleControllerError } from '../utils/error-handler.util.js';
import {
	extractPaginationInfo,
	PaginationType,
} from '../utils/pagination.util.js';
import { formatPagination } from '../utils/formatter.util.js';
import {
	formatPullRequestsList,
	formatPullRequestDetails,
	formatPullRequestComments,
} from './atlassian.pullrequests.formatter.js';
import {
	PullRequestComment,
	PullRequestCommentsResponse,
} from '../services/vendor.atlassian.pullrequests.types.js';
import { DEFAULT_PAGE_SIZE, applyDefaults } from '../utils/defaults.util.js';
import { extractDiffSnippet } from '../utils/diff.util.js';
import { optimizeBitbucketMarkdown } from '../utils/formatter.util.js';
import { getDefaultWorkspace } from '../utils/workspace.util.js';

/**
 * Base controller for managing Bitbucket pull requests.
 * Contains shared utilities and types used by the specific PR controller files.
 *
 * NOTE ON MARKDOWN HANDLING:
 * Unlike Jira (which uses ADF) or Confluence (which uses a mix of formats),
 * Bitbucket Cloud API natively accepts Markdown for text content in both directions:
 * - When sending data TO the API (comments, PR descriptions)
 * - When receiving data FROM the API (PR descriptions, comments)
 *
 * The API expects content in the format: { content: { raw: "markdown-text" } }
 *
 * We use optimizeBitbucketMarkdown() to address specific rendering quirks in
 * Bitbucket's markdown renderer but it does NOT perform format conversion.
 * See formatter.util.ts for details on the specific issues it addresses.
 */

// Define an extended type for internal use within the controller/formatter
// to include the code snippet.
export interface PullRequestCommentWithSnippet extends PullRequestComment {
	codeSnippet?: string;
}

// Define a service-specific type for listing comments
export type ListCommentsParams = {
	workspace: string;
	repo_slug: string;
	pull_request_id: number;
	pagelen?: number;
	page?: number;
};

// Define a service-specific type for creating comments
export type CreateCommentParams = {
	workspace: string;
	repo_slug: string;
	pull_request_id: number;
	content: {
		raw: string;
	};
	inline?: {
		path: string;
		to?: number;
	};
	parent?: {
		id: number;
	};
};

// Helper function to enhance comments with code snippets
export async function enhanceCommentsWithSnippets(
	commentsData: PullRequestCommentsResponse,
	controllerMethodName: string, // To contextualize logs
): Promise<PullRequestCommentWithSnippet[]> {
	const methodLogger = Logger.forContext(
		`controllers/atlassian.pullrequests.base.controller.ts`,
		controllerMethodName, // Use provided method name for logger context
	);
	const commentsWithSnippets: PullRequestCommentWithSnippet[] = [];

	if (!commentsData.values || commentsData.values.length === 0) {
		return [];
	}

	for (const comment of commentsData.values) {
		let snippet = undefined;
		if (
			comment.inline &&
			comment.links?.code?.href &&
			comment.inline.to !== undefined
		) {
			try {
				methodLogger.debug(
					`Fetching diff for inline comment ${comment.id} from ${comment.links.code.href}`,
				);
				const diffContent =
					await atlassianPullRequestsService.getDiffForUrl(
						comment.links.code.href,
					);
				snippet = extractDiffSnippet(diffContent, comment.inline.to);
				methodLogger.debug(
					`Extracted snippet for comment ${comment.id} (length: ${snippet?.length})`,
				);
			} catch (snippetError) {
				methodLogger.warn(
					`Failed to fetch or parse snippet for comment ${comment.id}:`,
					snippetError,
				);
				// Continue without snippet if fetching/parsing fails
			}
		}
		commentsWithSnippets.push({ ...comment, codeSnippet: snippet });
	}
	return commentsWithSnippets;
}

export {
	atlassianPullRequestsService,
	Logger,
	handleControllerError,
	extractPaginationInfo,
	PaginationType,
	formatPagination,
	formatPullRequestsList,
	formatPullRequestDetails,
	formatPullRequestComments,
	DEFAULT_PAGE_SIZE,
	applyDefaults,
	optimizeBitbucketMarkdown,
	getDefaultWorkspace,
};
