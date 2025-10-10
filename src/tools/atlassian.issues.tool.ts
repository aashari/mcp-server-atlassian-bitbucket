import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Logger } from '../utils/logger.util.js';
import { formatErrorForMcpTool } from '../utils/error.util.js';
import {
	ListIssuesToolArgs,
	type ListIssuesToolArgsType,
	GetIssueToolArgs,
	type GetIssueToolArgsType,
	CreateIssueToolArgs,
	type CreateIssueToolArgsType,
	UpdateIssueToolArgs,
	type UpdateIssueToolArgsType,
	DeleteIssueToolArgs,
	type DeleteIssueToolArgsType,
	ListIssueCommentsToolArgs,
	type ListIssueCommentsToolArgsType,
	AddIssueCommentToolArgs,
	type AddIssueCommentToolArgsType,
} from './atlassian.issues.types.js';
import atlassianIssuesController from '../controllers/atlassian.issues.controller.js';

// Create a contextualized logger for this file
const toolLogger = Logger.forContext('tools/atlassian.issues.tool.ts');

// Log tool initialization
toolLogger.debug('Bitbucket issues tool initialized');

/**
 * MCP Tool: List Bitbucket Issues
 *
 * Lists issues for a specific repository with optional filtering.
 * Returns a formatted markdown response with issue details.
 *
 * @param args - Tool arguments for filtering issues
 * @returns MCP response with formatted issues list
 * @throws Will return error message if issue listing fails
 */
async function listIssues(args: Record<string, unknown>) {
	const methodLogger = Logger.forContext(
		'tools/atlassian.issues.tool.ts',
		'listIssues',
	);
	methodLogger.debug('Listing Bitbucket issues with filters:', args);

	try {
		// Pass args directly to controller without any logic
		const result = await atlassianIssuesController.list(
			args as ListIssuesToolArgsType,
		);

		methodLogger.debug('Successfully retrieved issues from controller');

		return {
			content: [
				{
					type: 'text' as const,
					text: result.content,
				},
			],
		};
	} catch (error) {
		methodLogger.error('Failed to list issues', error);
		return formatErrorForMcpTool(error);
	}
}

/**
 * MCP Tool: Get Bitbucket Issue Details
 *
 * Retrieves detailed information about a specific issue.
 * Returns a formatted markdown response with issue details.
 *
 * @param args - Tool arguments containing the workspace, repository, and issue identifiers
 * @returns MCP response with formatted issue details
 * @throws Will return error message if issue retrieval fails
 */
async function getIssue(args: Record<string, unknown>) {
	const methodLogger = Logger.forContext(
		'tools/atlassian.issues.tool.ts',
		'getIssue',
	);
	methodLogger.debug('Getting Bitbucket issue details:', args);

	try {
		// Pass args directly to controller
		const result = await atlassianIssuesController.get(
			args as GetIssueToolArgsType,
		);

		methodLogger.debug(
			'Successfully retrieved issue details from controller',
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
		methodLogger.error('Failed to get issue details', error);
		return formatErrorForMcpTool(error);
	}
}

/**
 * MCP Tool: Create Bitbucket Issue
 *
 * Creates a new issue in a repository.
 * Returns a formatted markdown response with created issue details.
 *
 * @param args - Tool arguments containing workspace, repository, title, and optional description
 * @returns MCP response with formatted created issue details
 * @throws Will return error message if issue creation fails
 */
async function createIssue(args: Record<string, unknown>) {
	const methodLogger = Logger.forContext(
		'tools/atlassian.issues.tool.ts',
		'createIssue',
	);
	methodLogger.debug('Creating Bitbucket issue:', args);

	try {
		// Pass args directly to controller
		const result = await atlassianIssuesController.create(
			args as CreateIssueToolArgsType,
		);

		methodLogger.debug('Successfully created issue via controller');

		return {
			content: [
				{
					type: 'text' as const,
					text: result.content,
				},
			],
		};
	} catch (error) {
		methodLogger.error('Failed to create issue', error);
		return formatErrorForMcpTool(error);
	}
}

/**
 * MCP Tool: Update Bitbucket Issue
 *
 * Updates an existing issue in a repository.
 * Returns a formatted markdown response with updated issue details.
 *
 * @param args - Tool arguments containing workspace, repository, issue ID, and fields to update
 * @returns MCP response with formatted updated issue details
 * @throws Will return error message if issue update fails
 */
async function updateIssue(args: Record<string, unknown>) {
	const methodLogger = Logger.forContext(
		'tools/atlassian.issues.tool.ts',
		'updateIssue',
	);
	methodLogger.debug('Updating Bitbucket issue:', args);

	try {
		// Pass args directly to controller
		const result = await atlassianIssuesController.update(
			args as UpdateIssueToolArgsType,
		);

		methodLogger.debug('Successfully updated issue via controller');

		return {
			content: [
				{
					type: 'text' as const,
					text: result.content,
				},
			],
		};
	} catch (error) {
		methodLogger.error('Failed to update issue', error);
		return formatErrorForMcpTool(error);
	}
}

/**
 * MCP Tool: Delete Bitbucket Issue
 *
 * Deletes an issue from a repository.
 * Returns a success confirmation message.
 *
 * @param args - Tool arguments containing workspace, repository, and issue ID
 * @returns MCP response with success confirmation
 * @throws Will return error message if issue deletion fails
 */
async function deleteIssue(args: Record<string, unknown>) {
	const methodLogger = Logger.forContext(
		'tools/atlassian.issues.tool.ts',
		'deleteIssue',
	);
	methodLogger.debug('Deleting Bitbucket issue:', args);

	try {
		// Pass args directly to controller
		const result = await atlassianIssuesController.remove(
			args as DeleteIssueToolArgsType,
		);

		methodLogger.debug('Successfully deleted issue via controller');

		return {
			content: [
				{
					type: 'text' as const,
					text: result.content,
				},
			],
		};
	} catch (error) {
		methodLogger.error('Failed to delete issue', error);
		return formatErrorForMcpTool(error);
	}
}

/**
 * MCP Tool: List Bitbucket Issue Comments
 *
 * Lists comments on a specific issue.
 * Returns a formatted markdown response with comment details.
 *
 * @param args - Tool arguments containing workspace, repository, and issue ID
 * @returns MCP response with formatted comments list
 * @throws Will return error message if comment listing fails
 */
async function listIssueComments(args: Record<string, unknown>) {
	const methodLogger = Logger.forContext(
		'tools/atlassian.issues.tool.ts',
		'listIssueComments',
	);
	methodLogger.debug('Listing issue comments:', args);

	try {
		// Pass args directly to controller
		const result = await atlassianIssuesController.listComments(
			args as ListIssueCommentsToolArgsType,
		);

		methodLogger.debug('Successfully retrieved comments from controller');

		return {
			content: [
				{
					type: 'text' as const,
					text: result.content,
				},
			],
		};
	} catch (error) {
		methodLogger.error('Failed to list comments', error);
		return formatErrorForMcpTool(error);
	}
}

/**
 * MCP Tool: Add Bitbucket Issue Comment
 *
 * Adds a comment to a specific issue.
 * Returns a success confirmation message.
 *
 * @param args - Tool arguments containing workspace, repository, issue ID, and comment content
 * @returns MCP response with success confirmation
 * @throws Will return error message if comment addition fails
 */
async function addIssueComment(args: Record<string, unknown>) {
	const methodLogger = Logger.forContext(
		'tools/atlassian.issues.tool.ts',
		'addIssueComment',
	);
	methodLogger.debug('Adding comment to issue:', args);

	try {
		// Pass args directly to controller
		const result = await atlassianIssuesController.addComment(
			args as AddIssueCommentToolArgsType,
		);

		methodLogger.debug('Successfully added comment via controller');

		return {
			content: [
				{
					type: 'text' as const,
					text: result.content,
				},
			],
		};
	} catch (error) {
		methodLogger.error('Failed to add comment', error);
		return formatErrorForMcpTool(error);
	}
}

/**
 * Register all Bitbucket issues tools with the MCP server
 * @param server - The MCP server instance to register tools with
 */
function registerTools(server: McpServer) {
	const methodLogger = Logger.forContext(
		'tools/atlassian.issues.tool.ts',
		'registerTools',
	);
	methodLogger.debug('Registering Bitbucket issues tools');

	// Register bb_ls_issues
	server.tool(
		'bb_ls_issues',
		'Lists issues for a repository. Returns formatted list with issue details, status, and priority. Supports filtering by status, kind, priority, and BBQL query expressions. The query parameter uses BBQL (Bitbucket Query Language) syntax with operators: ~ (contains), = (equals), !=, >, >=, <, <=, AND, OR. Example queries: title ~ "bug", state="open" AND priority>="major". Requires Bitbucket credentials with issue scope.',
		ListIssuesToolArgs.shape,
		listIssues,
	);

	// Register bb_get_issue
	server.tool(
		'bb_get_issue',
		'Gets detailed information about a specific issue. Returns full issue details including description, reporter, assignee, and metadata. Requires issue scope.',
		GetIssueToolArgs.shape,
		getIssue,
	);

	// Register bb_create_issue
	server.tool(
		'bb_create_issue',
		'Creates a new issue in a repository. Returns the created issue details with ID. Specify title (required), description, kind (bug/enhancement/proposal/task), and priority. Requires issue scope.',
		CreateIssueToolArgs.shape,
		createIssue,
	);

	// Register bb_update_issue
	server.tool(
		'bb_update_issue',
		'Updates an existing issue. Returns the updated issue details. Can modify title, description, status, kind, priority, or assignee. Requires issue:write scope for status transitions and deletions.',
		UpdateIssueToolArgs.shape,
		updateIssue,
	);

	// Register bb_delete_issue
	server.tool(
		'bb_delete_issue',
		'Deletes an issue from the repository. Returns success confirmation. This operation is permanent and requires issue:write scope.',
		DeleteIssueToolArgs.shape,
		deleteIssue,
	);

	// Register bb_ls_issue_comments
	server.tool(
		'bb_ls_issue_comments',
		'Lists comments on an issue. Returns formatted comment thread with authors and timestamps. Requires issue scope.',
		ListIssueCommentsToolArgs.shape,
		listIssueComments,
	);

	// Register bb_add_issue_comment
	server.tool(
		'bb_add_issue_comment',
		'Adds a comment to an issue. Returns success confirmation with comment details. Content supports markdown formatting. Requires issue scope.',
		AddIssueCommentToolArgs.shape,
		addIssueComment,
	);

	methodLogger.debug('Successfully registered all Bitbucket issues tools');
}

export default { registerTools };
