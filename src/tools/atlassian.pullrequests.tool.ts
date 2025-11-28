import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { Logger } from '../utils/logger.util.js';
import { formatErrorForMcpTool } from '../utils/error.util.js';
import {
	CreatePullRequestCommentToolArgs,
	type CreatePullRequestCommentToolArgsType,
	CreatePullRequestToolArgs,
	type CreatePullRequestToolArgsType,
	UpdatePullRequestToolArgs,
	type UpdatePullRequestToolArgsType,
	ApprovePullRequestToolArgs,
	type ApprovePullRequestToolArgsType,
	RejectPullRequestToolArgs,
	type RejectPullRequestToolArgsType,
} from './atlassian.pullrequests.types.js';
import atlassianPullRequestsController from '../controllers/atlassian.pullrequests.controller.js';

// Create a contextualized logger for this file
const toolLogger = Logger.forContext('tools/atlassian.pullrequests.tool.ts');

// Log tool initialization
toolLogger.debug('Bitbucket pull requests tool initialized');

/**
 * MCP Tool: Add Bitbucket Pull Request Comment
 *
 * Adds a comment to a specific pull request, with support for general and inline comments.
 * Returns a success message as markdown.
 *
 * @param args - Tool arguments containing workspace, repository, PR ID, and comment content
 * @returns MCP response with formatted success message
 * @throws Will return error message if comment creation fails
 */
async function addPullRequestComment(args: Record<string, unknown>) {
	const methodLogger = Logger.forContext(
		'tools/atlassian.pullrequests.tool.ts',
		'addPullRequestComment',
	);
	methodLogger.debug('Adding pull request comment:', {
		...args,
		content: args.content
			? `(length: ${(args.content as string).length})`
			: '(none)',
	});

	try {
		// Pass args directly to controller
		const result = await atlassianPullRequestsController.addComment(
			args as CreatePullRequestCommentToolArgsType,
		);

		methodLogger.debug(
			'Successfully added pull request comment via controller',
		);

		return {
			content: [
				{
					type: 'text' as const,
					text: result.content,
				},
			],
		};
	} catch (error) {
		methodLogger.error('Failed to add pull request comment', error);
		return formatErrorForMcpTool(error);
	}
}

/**
 * MCP Tool: Create Bitbucket Pull Request
 *
 * Creates a new pull request between two branches in a Bitbucket repository.
 * Returns a formatted markdown response with the newly created pull request details.
 *
 * @param args - Tool arguments containing workspace, repository, source branch, destination branch, and title
 * @returns MCP response with formatted pull request details
 * @throws Will return error message if pull request creation fails
 */
async function addPullRequest(args: Record<string, unknown>) {
	const methodLogger = Logger.forContext(
		'tools/atlassian.pullrequests.tool.ts',
		'addPullRequest',
	);
	methodLogger.debug('Creating new pull request:', {
		...args,
		description: args.description
			? `(length: ${(args.description as string).length})`
			: '(none)',
	});

	try {
		// Pass args directly to controller
		const result = await atlassianPullRequestsController.add(
			args as CreatePullRequestToolArgsType,
		);

		methodLogger.debug('Successfully created pull request via controller');

		return {
			content: [
				{
					type: 'text' as const,
					text: result.content,
				},
			],
		};
	} catch (error) {
		methodLogger.error('Failed to create pull request', error);
		return formatErrorForMcpTool(error);
	}
}

/**
 * MCP Tool: Update Bitbucket Pull Request
 *
 * Updates an existing pull request's title and/or description.
 * Returns a formatted markdown response with updated pull request details.
 *
 * @param args - Tool arguments for updating pull request
 * @returns MCP response with formatted updated pull request details
 * @throws Will return error message if pull request update fails
 */
async function updatePullRequest(args: Record<string, unknown>) {
	const methodLogger = Logger.forContext(
		'tools/atlassian.pullrequests.tool.ts',
		'updatePullRequest',
	);
	methodLogger.debug('Updating pull request:', {
		...args,
		description: args.description
			? `(length: ${(args.description as string).length})`
			: '(unchanged)',
	});

	try {
		// Pass args directly to controller
		const result = await atlassianPullRequestsController.update(
			args as UpdatePullRequestToolArgsType,
		);

		methodLogger.debug('Successfully updated pull request via controller');

		return {
			content: [
				{
					type: 'text' as const,
					text: result.content,
				},
			],
		};
	} catch (error) {
		methodLogger.error('Failed to update pull request', error);
		return formatErrorForMcpTool(error);
	}
}

/**
 * MCP Tool: Approve Bitbucket Pull Request
 *
 * Approves a pull request, marking it as approved by the current user.
 * Returns a formatted markdown response with approval confirmation.
 *
 * @param args - Tool arguments for approving pull request
 * @returns MCP response with formatted approval confirmation
 * @throws Will return error message if pull request approval fails
 */
async function approvePullRequest(args: Record<string, unknown>) {
	const methodLogger = Logger.forContext(
		'tools/atlassian.pullrequests.tool.ts',
		'approvePullRequest',
	);
	methodLogger.debug('Approving pull request:', args);

	try {
		// Pass args directly to controller
		const result = await atlassianPullRequestsController.approve(
			args as ApprovePullRequestToolArgsType,
		);

		methodLogger.debug('Successfully approved pull request via controller');

		return {
			content: [
				{
					type: 'text' as const,
					text: result.content,
				},
			],
		};
	} catch (error) {
		methodLogger.error('Failed to approve pull request', error);
		return formatErrorForMcpTool(error);
	}
}

/**
 * MCP Tool: Request Changes on Bitbucket Pull Request
 *
 * Requests changes on a pull request, marking it as requiring changes by the current user.
 * Returns a formatted markdown response with rejection confirmation.
 *
 * @param args - Tool arguments for requesting changes on pull request
 * @returns MCP response with formatted rejection confirmation
 * @throws Will return error message if pull request rejection fails
 */
async function rejectPullRequest(args: Record<string, unknown>) {
	const methodLogger = Logger.forContext(
		'tools/atlassian.pullrequests.tool.ts',
		'rejectPullRequest',
	);
	methodLogger.debug('Requesting changes on pull request:', args);

	try {
		// Pass args directly to controller
		const result = await atlassianPullRequestsController.reject(
			args as RejectPullRequestToolArgsType,
		);

		methodLogger.debug(
			'Successfully requested changes on pull request via controller',
		);

		return {
			content: [
				{
					type: 'text' as const,
					text: result.content,
				},
			],
		};
	} catch (error) {
		methodLogger.error('Failed to request changes on pull request', error);
		return formatErrorForMcpTool(error);
	}
}

/**
 * Register Atlassian Pull Requests MCP Tools
 *
 * Registers the pull requests-related tools with the MCP server.
 * Each tool is registered with its schema, description, and handler function.
 *
 * NOTE: bb_ls_prs has been replaced by the generic bb_get tool.
 * Use: bb_get({ path: "/repositories/{workspace}/{repo_slug}/pullrequests" })
 *
 * NOTE: bb_ls_pr_comments has been replaced by the generic bb_get tool.
 * Use: bb_get({ path: "/repositories/{workspace}/{repo_slug}/pullrequests/{pr_id}/comments" })
 *
 * NOTE: bb_get_pr has been replaced by the generic bb_get tool.
 * Use: bb_get({ path: "/repositories/{workspace}/{repo_slug}/pullrequests/{pr_id}" })
 *
 * @param server - The MCP server instance to register tools with
 */
function registerTools(server: McpServer) {
	const methodLogger = Logger.forContext(
		'tools/atlassian.pullrequests.tool.ts',
		'registerTools',
	);
	methodLogger.debug('Registering Atlassian Pull Requests tools...');

	// Register the add pull request comment tool
	server.tool(
		'bb_add_pr_comment',
		`Adds a comment to a specific pull request identified by \`prId\` within a repository (\`repoSlug\`). If \`workspaceSlug\` is not provided, the system will use your default workspace. The \`content\` parameter accepts Markdown-formatted text for the comment body. To reply to an existing comment, provide its ID in the \`parentId\` parameter. For inline code comments, provide both \`inline.path\` (file path) and \`inline.line\` (line number). Returns a success message as formatted Markdown. Requires Bitbucket credentials with write permissions to be configured.`,
		CreatePullRequestCommentToolArgs.shape,
		addPullRequestComment,
	);

	// Register the create pull request tool
	// Note: Using prTitle instead of title to avoid MCP SDK conflict
	const createPrSchema = z.object({
		workspaceSlug: CreatePullRequestToolArgs.shape.workspaceSlug,
		repoSlug: CreatePullRequestToolArgs.shape.repoSlug,
		prTitle: CreatePullRequestToolArgs.shape.title, // Renamed from 'title' to 'prTitle'
		sourceBranch: CreatePullRequestToolArgs.shape.sourceBranch,
		destinationBranch: CreatePullRequestToolArgs.shape.destinationBranch,
		description: CreatePullRequestToolArgs.shape.description,
		closeSourceBranch: CreatePullRequestToolArgs.shape.closeSourceBranch,
	});
	server.tool(
		'bb_add_pr',
		`Creates a new pull request in a repository (\`repoSlug\`). If \`workspaceSlug\` is not provided, the system will use your default workspace. Required parameters include \`prTitle\` (the PR title), \`sourceBranch\` (branch with changes), and optionally \`destinationBranch\` (target branch, defaults to main/master). The \`description\` parameter accepts Markdown-formatted text for the PR description. Set \`closeSourceBranch\` to true to automatically delete the source branch after merging. Returns the newly created pull request details as formatted Markdown. Requires Bitbucket credentials with write permissions to be configured.`,
		createPrSchema.shape,
		async (args: Record<string, unknown>) => {
			// Map prTitle back to title for the controller
			const mappedArgs = { ...args, title: args.prTitle };
			delete (mappedArgs as Record<string, unknown>).prTitle;
			return addPullRequest(mappedArgs);
		},
	);

	// Register the update pull request tool
	// Note: Using prTitle instead of title to avoid MCP SDK conflict
	const updatePrSchema = z.object({
		workspaceSlug: UpdatePullRequestToolArgs.shape.workspaceSlug,
		repoSlug: UpdatePullRequestToolArgs.shape.repoSlug,
		pullRequestId: UpdatePullRequestToolArgs.shape.pullRequestId,
		prTitle: UpdatePullRequestToolArgs.shape.title, // Renamed from 'title' to 'prTitle'
		description: UpdatePullRequestToolArgs.shape.description,
	});
	server.tool(
		'bb_update_pr',
		`Updates an existing pull request in a repository (\`repoSlug\`) identified by \`pullRequestId\`. If \`workspaceSlug\` is not provided, the system will use your default workspace. You can update the \`prTitle\` (the PR title) and/or \`description\` fields. At least one field must be provided. The \`description\` parameter accepts Markdown-formatted text. Returns the updated pull request details as formatted Markdown. Requires Bitbucket credentials with write permissions to be configured.`,
		updatePrSchema.shape,
		async (args: Record<string, unknown>) => {
			// Map prTitle back to title for the controller
			const mappedArgs = { ...args, title: args.prTitle };
			delete (mappedArgs as Record<string, unknown>).prTitle;
			return updatePullRequest(mappedArgs);
		},
	);

	// Register the approve pull request tool
	server.tool(
		'bb_approve_pr',
		`Approves a pull request in a repository (\`repoSlug\`) identified by \`pullRequestId\`. If \`workspaceSlug\` is not provided, the system will use your default workspace. This marks the pull request as approved by the current user, indicating that the changes are ready for merge (pending any other required approvals or checks). Returns an approval confirmation as formatted Markdown. Requires Bitbucket credentials with appropriate permissions to be configured.`,
		ApprovePullRequestToolArgs.shape,
		approvePullRequest,
	);

	// Register the reject pull request tool
	server.tool(
		'bb_reject_pr',
		`Requests changes on a pull request in a repository (\`repoSlug\`) identified by \`pullRequestId\`. If \`workspaceSlug\` is not provided, the system will use your default workspace. This marks the pull request as requiring changes by the current user, indicating that the author should address feedback before the pull request can be merged. Returns a rejection confirmation as formatted Markdown. Requires Bitbucket credentials with appropriate permissions to be configured.`,
		RejectPullRequestToolArgs.shape,
		rejectPullRequest,
	);

	methodLogger.debug('Successfully registered Pull Requests tools');
}

export default { registerTools };
