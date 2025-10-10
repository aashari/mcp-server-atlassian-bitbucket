import { Logger } from '../utils/logger.util.js';
import { handleControllerError } from '../utils/error-handler.util.js';
import { ControllerResponse } from '../types/common.types.js';
import {
	extractPaginationInfo,
	PaginationType,
} from '../utils/pagination.util.js';
import { formatPagination } from '../utils/formatter.util.js';
import {
	ListIssuesToolArgsType,
	GetIssueToolArgsType,
	CreateIssueToolArgsType,
	UpdateIssueToolArgsType,
	DeleteIssueToolArgsType,
	ListIssueCommentsToolArgsType,
	AddIssueCommentToolArgsType,
} from '../tools/atlassian.issues.types.js';
import service from '../services/vendor.atlassian.issues.service.js';
import {
	formatIssuesList,
	formatIssueDetails,
	formatCommentsList,
	formatIssueSuccess,
	formatCommentSuccess,
} from './atlassian.issues.formatter.js';

/**
 * Controller for managing Bitbucket issues.
 * Provides functionality for listing, retrieving, creating, updating, deleting issues and managing comments.
 */

// Create a contextualized logger for this file
const controllerLogger = Logger.forContext(
	'controllers/atlassian.issues.controller.ts',
);

// Log controller initialization
controllerLogger.debug('Bitbucket issues controller initialized');

/**
 * List Bitbucket issues with optional filtering options
 * @param options - Options for listing issues including workspace slug and repo slug
 * @returns Promise with formatted issues list content and pagination information
 */
async function list(
	options: ListIssuesToolArgsType,
): Promise<ControllerResponse> {
	const methodLogger = Logger.forContext(
		'controllers/atlassian.issues.controller.ts',
		'list',
	);
	methodLogger.debug('Listing Bitbucket issues with options:', options);

	try {
		// Apply defaults
		const pagelen = options.limit || 10;

		// Build service params
		const serviceParams = {
			workspace: options.workspaceSlug,
			repo_slug: options.repoSlug,
			status: options.status,
			kind: options.kind,
			priority: options.priority,
			q: options.query,
			sort: options.sort,
			pagelen,
			page: options.page,
		};

		// Call service
		const data = await service.list(serviceParams);

		// Format response
		const formattedData = formatIssuesList(data);

		// Extract pagination info
		const pagination = extractPaginationInfo(data, PaginationType.PAGE);

		// Build final content with pagination footer if needed
		let finalContent = formattedData;
		if (pagination && (pagination.hasMore || pagination.count)) {
			finalContent += '\n\n' + formatPagination(pagination);
		}

		return { content: finalContent };
	} catch (error) {
		// Enhance BBQL syntax error messages
		if (
			error instanceof Error &&
			error.message.includes('Invalid filter query expression')
		) {
			const enhancedMessage = `${error.message}\n\nHint: The 'query' parameter expects BBQL (Bitbucket Query Language) syntax.\nExamples: title ~ "bug", state="open" AND priority>="major", content.raw ~ "login"\nOperators: ~ (contains), = (equals), !=, >, >=, <, <=, AND, OR`;
			const enhancedError = new Error(enhancedMessage);
			// Preserve stack trace
			if (error.stack) {
				enhancedError.stack = error.stack;
			}
			throw handleControllerError(enhancedError, {
				entityType: 'Issues',
				operation: 'listing',
				source: 'controllers/atlassian.issues.controller.ts@list',
				additionalInfo: { options },
			});
		}

		throw handleControllerError(error, {
			entityType: 'Issues',
			operation: 'listing',
			source: 'controllers/atlassian.issues.controller.ts@list',
			additionalInfo: { options },
		});
	}
}

/**
 * Get detailed information about a specific Bitbucket issue
 * @param options - Options including workspace slug, repo slug, and issue ID
 * @returns Promise with formatted issue details as Markdown content
 */
async function get(options: GetIssueToolArgsType): Promise<ControllerResponse> {
	const methodLogger = Logger.forContext(
		'controllers/atlassian.issues.controller.ts',
		'get',
	);
	methodLogger.debug(
		'Getting Bitbucket issue details with options:',
		options,
	);

	try {
		// Build service params
		const serviceParams = {
			workspace: options.workspaceSlug,
			repo_slug: options.repoSlug,
			issue_id: options.issueId,
		};

		// Call service
		const issue = await service.get(serviceParams);

		// Format response
		const formattedData = formatIssueDetails(issue);

		return { content: formattedData };
	} catch (error) {
		throw handleControllerError(error, {
			entityType: 'Issue',
			operation: 'retrieving',
			source: 'controllers/atlassian.issues.controller.ts@get',
			additionalInfo: { options },
		});
	}
}

/**
 * Create a new issue in Bitbucket
 * @param options - Options including workspace slug, repo slug, title, and optional description
 * @returns Promise with formatted created issue details as Markdown content
 */
async function create(
	options: CreateIssueToolArgsType,
): Promise<ControllerResponse> {
	const methodLogger = Logger.forContext(
		'controllers/atlassian.issues.controller.ts',
		'create',
	);
	methodLogger.debug('Creating Bitbucket issue with options:', options);

	try {
		// Validate required fields
		if (!options.title || options.title.trim() === '') {
			throw new Error('Issue title is required');
		}

		// Build service params
		const serviceParams = {
			workspace: options.workspaceSlug,
			repo_slug: options.repoSlug,
			title: options.title,
			content: options.content,
			kind: options.kind,
			priority: options.priority,
		};

		// Call service
		const issue = await service.create(serviceParams);

		// Format response
		const formattedData = formatIssueSuccess(issue, 'created');

		return { content: formattedData };
	} catch (error) {
		throw handleControllerError(error, {
			entityType: 'Issue',
			operation: 'creating',
			source: 'controllers/atlassian.issues.controller.ts@create',
			additionalInfo: { options },
		});
	}
}

/**
 * Update an existing issue in Bitbucket
 * @param options - Options including workspace slug, repo slug, issue ID, and fields to update
 * @returns Promise with formatted updated issue details as Markdown content
 */
async function update(
	options: UpdateIssueToolArgsType,
): Promise<ControllerResponse> {
	const methodLogger = Logger.forContext(
		'controllers/atlassian.issues.controller.ts',
		'update',
	);
	methodLogger.debug('Updating Bitbucket issue with options:', options);

	try {
		// Build service params with only provided fields
		const serviceParams = {
			workspace: options.workspaceSlug,
			repo_slug: options.repoSlug,
			issue_id: options.issueId,
			title: options.title,
			content: options.content,
			status: options.status,
			kind: options.kind,
			priority: options.priority,
			assignee: options.assignee,
		};

		// Call service
		const issue = await service.update(serviceParams);

		// Format response
		const formattedData = formatIssueSuccess(issue, 'updated');

		return { content: formattedData };
	} catch (error) {
		throw handleControllerError(error, {
			entityType: 'Issue',
			operation: 'updating',
			source: 'controllers/atlassian.issues.controller.ts@update',
			additionalInfo: { options },
		});
	}
}

/**
 * Delete an issue from Bitbucket
 * @param options - Options including workspace slug, repo slug, and issue ID
 * @returns Promise with success confirmation message
 */
async function remove(
	options: DeleteIssueToolArgsType,
): Promise<ControllerResponse> {
	const methodLogger = Logger.forContext(
		'controllers/atlassian.issues.controller.ts',
		'remove',
	);
	methodLogger.debug('Deleting Bitbucket issue with options:', options);

	try {
		// Build service params
		const serviceParams = {
			workspace: options.workspaceSlug,
			repo_slug: options.repoSlug,
			issue_id: options.issueId,
		};

		// Call service
		await service.remove(serviceParams);

		// Return success message
		return {
			content: `✓ Issue #${options.issueId} deleted successfully`,
		};
	} catch (error) {
		throw handleControllerError(error, {
			entityType: 'Issue',
			operation: 'deleting',
			source: 'controllers/atlassian.issues.controller.ts@remove',
			additionalInfo: { options },
		});
	}
}

/**
 * List comments on a Bitbucket issue
 * @param options - Options including workspace slug, repo slug, and issue ID
 * @returns Promise with formatted comments as Markdown content
 */
async function listComments(
	options: ListIssueCommentsToolArgsType,
): Promise<ControllerResponse> {
	const methodLogger = Logger.forContext(
		'controllers/atlassian.issues.controller.ts',
		'listComments',
	);
	methodLogger.debug('Listing issue comments with options:', options);

	try {
		// Apply defaults
		const pagelen = options.limit || 20;

		// Build service params
		const serviceParams = {
			workspace: options.workspaceSlug,
			repo_slug: options.repoSlug,
			issue_id: options.issueId,
			pagelen,
			page: options.page,
		};

		// Call service
		const data = await service.listComments(serviceParams);

		// Format response
		const formattedData = formatCommentsList(data);

		// Extract pagination info
		const pagination = extractPaginationInfo(data, PaginationType.PAGE);

		// Build final content with pagination footer if needed
		let finalContent = formattedData;
		if (pagination && (pagination.hasMore || pagination.count)) {
			finalContent += '\n\n' + formatPagination(pagination);
		}

		return { content: finalContent };
	} catch (error) {
		throw handleControllerError(error, {
			entityType: 'Issue Comments',
			operation: 'listing',
			source: 'controllers/atlassian.issues.controller.ts@listComments',
			additionalInfo: { options },
		});
	}
}

/**
 * Add a comment to a Bitbucket issue
 * @param options - Options including workspace slug, repo slug, issue ID, and comment content
 * @returns Promise with success confirmation message
 */
async function addComment(
	options: AddIssueCommentToolArgsType,
): Promise<ControllerResponse> {
	const methodLogger = Logger.forContext(
		'controllers/atlassian.issues.controller.ts',
		'addComment',
	);
	methodLogger.debug('Adding comment to issue with options:', options);

	try {
		// Validate required fields
		if (!options.content || options.content.trim() === '') {
			throw new Error('Comment content is required');
		}

		// Build service params
		const serviceParams = {
			workspace: options.workspaceSlug,
			repo_slug: options.repoSlug,
			issue_id: options.issueId,
			content: options.content,
		};

		// Call service
		const comment = await service.addComment(serviceParams);

		// Format response
		const formattedData = formatCommentSuccess(comment);

		return { content: formattedData };
	} catch (error) {
		throw handleControllerError(error, {
			entityType: 'Issue Comment',
			operation: 'adding',
			source: 'controllers/atlassian.issues.controller.ts@addComment',
			additionalInfo: { options },
		});
	}
}

export default { list, get, create, update, remove, listComments, addComment };
