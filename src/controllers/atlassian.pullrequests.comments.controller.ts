import { ControllerResponse } from '../types/common.types.js';
import {
	ListPullRequestCommentsToolArgsType,
	CreatePullRequestCommentToolArgsType,
} from '../tools/atlassian.pullrequests.types.js';
import {
	atlassianPullRequestsService,
	Logger,
	handleControllerError,
	extractPaginationInfo,
	PaginationType,
	formatPagination,
	formatPullRequestComments,
	DEFAULT_PAGE_SIZE,
	applyDefaults,
	enhanceCommentsWithSnippets,
	optimizeBitbucketMarkdown,
	getDefaultWorkspace,
	ListCommentsParams,
	CreateCommentParams,
} from './atlassian.pullrequests.base.controller.js';

/**
 * List comments on a Bitbucket pull request
 * @param options - Options including workspace slug, repo slug, and pull request ID
 * @returns Promise with formatted pull request comments as Markdown content
 */
async function listComments(
	options: ListPullRequestCommentsToolArgsType,
): Promise<ControllerResponse> {
	const methodLogger = Logger.forContext(
		'controllers/atlassian.pullrequests.comments.controller.ts',
		'listComments',
	);

	try {
		// Create defaults object
		const defaults: Partial<ListPullRequestCommentsToolArgsType> = {
			limit: DEFAULT_PAGE_SIZE,
		};

		// Apply defaults
		const mergedOptions =
			applyDefaults<ListPullRequestCommentsToolArgsType>(
				options,
				defaults,
			);

		// Handle optional workspaceSlug - get default if not provided
		if (!mergedOptions.workspaceSlug) {
			methodLogger.debug(
				'No workspace provided, fetching default workspace',
			);
			const defaultWorkspace = await getDefaultWorkspace();
			if (!defaultWorkspace) {
				throw new Error(
					'Could not determine a default workspace. Please provide a workspaceSlug.',
				);
			}
			mergedOptions.workspaceSlug = defaultWorkspace;
			methodLogger.debug(
				`Using default workspace: ${mergedOptions.workspaceSlug}`,
			);
		}

		const { workspaceSlug, repoSlug, prId } = mergedOptions;

		// Validate required parameters
		if (!workspaceSlug || !repoSlug || !prId) {
			throw new Error(
				'Workspace slug, repository slug, and pull request ID are required',
			);
		}

		methodLogger.debug(
			`Listing comments for PR ${workspaceSlug}/${repoSlug}/${prId}`,
			{ limit: mergedOptions.limit, cursor: mergedOptions.cursor },
		);

		// Map controller options to service parameters
		const serviceParams: ListCommentsParams = {
			workspace: workspaceSlug,
			repo_slug: repoSlug,
			pull_request_id: parseInt(prId, 10),
			pagelen: mergedOptions.limit,
			page: mergedOptions.cursor
				? parseInt(mergedOptions.cursor, 10)
				: undefined,
		};

		// Get comments from the service
		const commentsData =
			await atlassianPullRequestsService.getComments(serviceParams);

		methodLogger.debug(
			`Retrieved ${commentsData.values?.length || 0} comments`,
		);

		// If no comments found, return a simple message
		if (!commentsData.values || commentsData.values.length === 0) {
			return { content: 'No comments found on this pull request.' };
		}

		// Extract pagination information
		const pagination = extractPaginationInfo(
			commentsData,
			PaginationType.PAGE,
		);

		// Enhance comments with code snippets (for inline comments)
		const enhancedComments = await enhanceCommentsWithSnippets(
			commentsData,
			'listComments',
		);

		// Format the comments using the formatter
		const formattedComments = formatPullRequestComments(
			enhancedComments,
			prId,
		);

		// Create the final content by combining formatted comments with pagination info
		let finalContent = formattedComments;

		// Add pagination information if available
		if (
			pagination &&
			(pagination.hasMore || pagination.count !== undefined)
		) {
			const paginationString = formatPagination(pagination);
			finalContent += '\n\n' + paginationString;
		}

		return {
			content: finalContent,
		};
	} catch (error) {
		// Use the standardized error handler
		throw handleControllerError(error, {
			entityType: 'Pull Request Comments',
			operation: 'listing',
			source: 'controllers/atlassian.pullrequests.comments.controller.ts@listComments',
			additionalInfo: { options },
		});
	}
}

/**
 * Add a comment to a Bitbucket pull request
 * @param options - Options including workspace slug, repo slug, PR ID, and comment content
 * @returns Promise with a success message as content
 */
async function addComment(
	options: CreatePullRequestCommentToolArgsType,
): Promise<ControllerResponse> {
	const methodLogger = Logger.forContext(
		'controllers/atlassian.pullrequests.comments.controller.ts',
		'addComment',
	);

	try {
		// Apply defaults if needed (none for this operation)
		const mergedOptions =
			applyDefaults<CreatePullRequestCommentToolArgsType>(options, {});

		// Handle optional workspaceSlug - get default if not provided
		if (!mergedOptions.workspaceSlug) {
			methodLogger.debug(
				'No workspace provided, fetching default workspace',
			);
			const defaultWorkspace = await getDefaultWorkspace();
			if (!defaultWorkspace) {
				throw new Error(
					'Could not determine a default workspace. Please provide a workspaceSlug.',
				);
			}
			mergedOptions.workspaceSlug = defaultWorkspace;
			methodLogger.debug(
				`Using default workspace: ${mergedOptions.workspaceSlug}`,
			);
		}

		const { workspaceSlug, repoSlug, prId, content, inline } =
			mergedOptions;

		// Validate required parameters
		if (!workspaceSlug || !repoSlug || !prId || !content) {
			throw new Error(
				'Workspace slug, repository slug, pull request ID, and comment content are required',
			);
		}

		// For inline comments, both file path and line number are required
		if (inline && (!inline.path || inline.line === undefined)) {
			throw new Error(
				'Both file path and line number are required for inline comments',
			);
		}

		// Prepare the raw content, applying any Bitbucket-specific markdown optimizations
		const optimizedContent = optimizeBitbucketMarkdown(content);

		methodLogger.debug(
			`Adding${
				inline ? ' inline' : ''
			} comment to PR ${workspaceSlug}/${repoSlug}/${prId}`,
			{
				contentLength: optimizedContent.length,
				isInline: !!inline,
				inlinePath: inline?.path,
				inlineLine: inline?.line,
			},
		);

		// Map controller options to service parameters
		const serviceParams: CreateCommentParams = {
			workspace: workspaceSlug,
			repo_slug: repoSlug,
			pull_request_id: parseInt(prId, 10),
			content: {
				raw: optimizedContent,
			},
		};

		// For inline comments, add the inline property
		if (inline) {
			serviceParams.inline = {
				path: inline.path,
				to: inline.line,
			};
		}

		// For replies, add the parent property
		if (mergedOptions.parentId) {
			serviceParams.parent = {
				id: parseInt(mergedOptions.parentId, 10),
			};
		}

		// Create the comment through the service
		const commentResult =
			await atlassianPullRequestsService.createComment(serviceParams);

		methodLogger.debug('Comment created successfully', {
			commentId: commentResult.id,
			isInline: !!inline,
		});

		// Return a success message
		const commentType = inline ? 'inline' : '';
		return {
			content: `${commentType} Comment successfully added to pull request #${prId}. Comment ID: ${commentResult.id}`,
		};
	} catch (error) {
		// Use the standardized error handler
		throw handleControllerError(error, {
			entityType: 'Pull Request Comment',
			operation: 'adding',
			source: 'controllers/atlassian.pullrequests.comments.controller.ts@addComment',
			additionalInfo: { options },
		});
	}
}

// Export the controller functions
export default { listComments, addComment };
