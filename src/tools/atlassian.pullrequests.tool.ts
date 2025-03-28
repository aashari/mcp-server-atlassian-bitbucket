import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Logger } from '../utils/logger.util.js';
import { RequestHandlerExtra } from '@modelcontextprotocol/sdk/shared/protocol.js';
import { formatErrorForMcpTool } from '../utils/error.util.js';
import {
	ListPullRequestsToolArgs,
	ListPullRequestsToolArgsType,
	GetPullRequestToolArgs,
	GetPullRequestToolArgsType,
	ListPullRequestCommentsToolArgs,
	ListPullRequestCommentsToolArgsType,
	AddPullRequestCommentToolArgs,
	AddPullRequestCommentToolArgsType,
} from './atlassian.pullrequests.types.js';

import atlassianPullRequestsController from '../controllers/atlassian.pullrequests.controller.js';

// Create a contextualized logger for this file
const toolLogger = Logger.forContext('tools/atlassian.pullrequests.tool.ts');

// Log tool initialization
toolLogger.debug('Bitbucket pull requests tool initialized');

/**
 * MCP Tool: List Bitbucket Pull Requests
 *
 * Lists pull requests for a specific repository with optional filtering.
 * Returns a formatted markdown response with pull request details.
 *
 * @param args - Tool arguments for filtering pull requests
 * @param _extra - Extra request handler information (unused)
 * @returns MCP response with formatted pull requests list
 * @throws Will return error message if pull request listing fails
 */
async function listPullRequests(
	args: ListPullRequestsToolArgsType,
	_extra: RequestHandlerExtra,
) {
	const methodLogger = Logger.forContext(
		'tools/atlassian.pullrequests.tool.ts',
		'listPullRequests',
	);
	methodLogger.debug('Listing Bitbucket pull requests with filters:', args);

	try {
		// Pass the filter options to the controller
		const message = await atlassianPullRequestsController.list({
			workspaceSlug: args.workspaceSlug,
			repoSlug: args.repoSlug,
			state: args.state,
			query: args.query,
			limit: args.limit,
			cursor: args.cursor,
		});

		methodLogger.debug(
			'Successfully retrieved pull requests from controller',
			message,
		);

		return {
			content: [
				{
					type: 'text' as const,
					text: message.content,
				},
			],
		};
	} catch (error) {
		methodLogger.error('Failed to list pull requests', error);
		return formatErrorForMcpTool(error);
	}
}

/**
 * MCP Tool: Get Bitbucket Pull Request Details
 *
 * Retrieves detailed information about a specific Bitbucket pull request.
 * Returns a formatted markdown response with pull request metadata.
 *
 * @param args - Tool arguments containing workspace, repository, and PR identifiers
 * @param _extra - Extra request handler information (unused)
 * @returns MCP response with formatted pull request details
 * @throws Will return error message if pull request retrieval fails
 */
async function getPullRequest(
	args: GetPullRequestToolArgsType,
	_extra: RequestHandlerExtra,
) {
	const methodLogger = Logger.forContext(
		'tools/atlassian.pullrequests.tool.ts',
		'getPullRequest',
	);

	methodLogger.debug(
		`Retrieving pull request details for ${args.workspaceSlug}/${args.repoSlug}/${args.prId}`,
		args,
	);

	try {
		const message = await atlassianPullRequestsController.get({
			workspaceSlug: args.workspaceSlug,
			repoSlug: args.repoSlug,
			prId: args.prId,
		});

		methodLogger.debug(
			'Successfully retrieved pull request details from controller',
			message,
		);

		return {
			content: [
				{
					type: 'text' as const,
					text: message.content,
				},
			],
		};
	} catch (error) {
		methodLogger.error('Failed to get pull request details', error);
		return formatErrorForMcpTool(error);
	}
}

/**
 * MCP Tool: List Bitbucket Pull Request Comments
 *
 * Lists comments for a specific pull request, including general comments and inline code comments.
 * Returns a formatted markdown response with comment details.
 *
 * @param args - Tool arguments containing workspace, repository, and PR identifiers
 * @param _extra - Extra request handler information (unused)
 * @returns MCP response with formatted pull request comments
 * @throws Will return error message if comment retrieval fails
 */
async function listPullRequestComments(
	args: ListPullRequestCommentsToolArgsType,
	_extra: RequestHandlerExtra,
) {
	const methodLogger = Logger.forContext(
		'tools/atlassian.pullrequests.tool.ts',
		'listPullRequestComments',
	);

	methodLogger.debug(
		`Retrieving comments for pull request ${args.workspaceSlug}/${args.repoSlug}/${args.prId}`,
		args,
	);

	try {
		const message = await atlassianPullRequestsController.listComments({
			workspaceSlug: args.workspaceSlug,
			repoSlug: args.repoSlug,
			prId: args.prId,
			limit: args.limit,
			cursor: args.cursor,
		});

		methodLogger.debug(
			'Successfully retrieved pull request comments from controller',
			message,
		);

		return {
			content: [
				{
					type: 'text' as const,
					text: message.content,
				},
			],
		};
	} catch (error) {
		methodLogger.error('Failed to get pull request comments', error);
		return formatErrorForMcpTool(error);
	}
}

/**
 * MCP Tool: Add Comment to Bitbucket Pull Request
 *
 * Adds a new comment to a specific Bitbucket pull request.
 * The comment can be either a general comment or an inline code comment.
 *
 * @param args - Tool arguments containing workspace, repository, PR identifiers, and comment content
 * @param _extra - Extra request handler information (unused)
 * @returns MCP response confirming the comment was added
 * @throws Will return error message if comment addition fails
 */
async function addPullRequestComment(
	args: AddPullRequestCommentToolArgsType,
	_extra: RequestHandlerExtra,
) {
	const methodLogger = Logger.forContext(
		'tools/atlassian.pullrequests.tool.ts',
		'addPullRequestComment',
	);

	methodLogger.debug(
		`Adding comment to pull request ${args.workspaceSlug}/${args.repoSlug}/${args.prId}`,
		args,
	);

	try {
		const message = await atlassianPullRequestsController.addComment({
			workspaceSlug: args.workspaceSlug,
			repoSlug: args.repoSlug,
			prId: args.prId,
			content: args.content,
			inline: args.inline,
		});

		methodLogger.debug(
			'Successfully added pull request comment',
			message,
		);

		return {
			content: [
				{
					type: 'text' as const,
					text: message.content,
				},
			],
		};
	} catch (error) {
		methodLogger.error('Failed to add pull request comment', error);
		return formatErrorForMcpTool(error);
	}
}

/**
 * Register Atlassian Pull Requests MCP Tools
 *
 * Registers the list-pull-requests and get-pull-request tools with the MCP server.
 * Each tool is registered with its schema, description, and handler function.
 *
 * @param server - The MCP server instance to register tools with
 */
function register(server: McpServer) {
	const methodLogger = Logger.forContext(
		'tools/atlassian.pullrequests.tool.ts',
		'register',
	);
	methodLogger.debug('Registering Atlassian Pull Requests tools...');

	// Register the list pull requests tool
	server.tool(
		'list_pull_requests',
		`List pull requests for a specific Bitbucket repository, with optional filtering by state or query text. Requires 'workspaceSlug' and 'repoSlug'.

        PURPOSE: Discover pull requests within a given repository and retrieve their IDs, titles, states, authors, and branches. Essential for finding the 'prId' needed for the 'get_pull_request' tool.

        WHEN TO USE:
        - To find open, merged, declined, or superseded pull requests within a specific repository.
        - To get a list of recent PR activity for a repository.
        - To search for PRs containing specific text in their title or description ('query' parameter).
        - To obtain 'prId' values for use with 'get_pull_request'.
        - Requires known 'workspaceSlug' and 'repoSlug'.

        WHEN NOT TO USE:
        - When you don't know the 'workspaceSlug' or 'repoSlug' (use workspace/repository listing tools first).
        - When you already have the 'prId' and need full details (use 'get_pull_request').
        - When you need repository information (use repository tools).

        RETURNS: Formatted list of pull requests including ID, title, state, author, source/destination branches, a snippet of the description, and URL. Includes pagination details if applicable.

        EXAMPLES:
        - List open PRs: { workspaceSlug: "my-team", repoSlug: "backend-api", state: "OPEN" }
        - List merged PRs: { workspaceSlug: "my-team", repoSlug: "backend-api", state: "MERGED" }
        - Search PR titles/descriptions: { workspaceSlug: "my-team", repoSlug: "backend-api", query: "bugfix" }
        - Paginate results: { workspaceSlug: "my-team", repoSlug: "backend-api", limit: 10, cursor: "next-page-token" }

        ERRORS:
        - Repository not found: Verify 'workspaceSlug' and 'repoSlug'.
        - Permission errors: Ensure access to the repository's pull requests.
        - Invalid state: Ensure 'state' is one of OPEN, MERGED, DECLINED, SUPERSEDED.`,
		ListPullRequestsToolArgs.shape,
		listPullRequests,
	);

	// Register the get pull request details tool
	server.tool(
		'get_pull_request',
		`Get detailed information about a specific Bitbucket pull request using its workspace slug, repository slug, and pull request ID. Requires 'workspaceSlug', 'repoSlug', and 'prId'.

        PURPOSE: Retrieves comprehensive details for a *known* pull request, including its full description, state, author, reviewers, source/destination branches, and links to related resources like commits and diffs.

        WHEN TO USE:
        - When you need the full context, description, or reviewer list for a *specific* pull request.
        - After using 'list_pull_requests' to identify the target 'prId'.
        - To get links to view the PR diff, commits, or comments in the browser.
        - Requires known 'workspaceSlug', 'repoSlug', and 'prId'.

        WHEN NOT TO USE:
        - When you don't know the 'prId' (use 'list_pull_requests' first).
        - When you only need a list of pull requests (use 'list_pull_requests').
        - When you need repository information (use repository tools).

        RETURNS: Detailed pull request information including title, full description, state, author, reviewers, branches, and links. Fetches all available details by default.

        EXAMPLES:
        - Get details for a specific PR: { workspaceSlug: "my-team", repoSlug: "backend-api", prId: "42" }

        ERRORS:
        - Pull Request not found: Verify 'workspaceSlug', 'repoSlug', and 'prId' are correct.
        - Repository not found: Verify 'workspaceSlug' and 'repoSlug'.
        - Permission errors: Ensure access to view the specified pull request.`,
		GetPullRequestToolArgs.shape,
		getPullRequest,
	);

	// Register the list pull request comments tool
	server.tool(
		'list_pr_comments',
		`List comments on a specific Bitbucket pull request using its workspace slug, repository slug, and pull request ID. Requires 'workspaceSlug', 'repoSlug', and 'prId'.

        PURPOSE: View all review feedback, discussions, and task comments on a pull request to understand code review context without accessing the web UI.

        WHEN TO USE:
        - To see what reviewers have said about a pull request.
        - To find inline code comments and their context (file, line number).
        - After identifying a PR of interest via 'list_pull_requests'.
        - When you need to understand review history, discussions, and decisions.
        - Requires known 'workspaceSlug', 'repoSlug', and 'prId'.

        WHEN NOT TO USE:
        - When you don't know the pull request ID (use 'list_pull_requests' first).
        - When you need the PR's metadata but not comments (use 'get_pull_request').
        - When you need to post new comments (not supported).

        RETURNS: Formatted list of comments with author, date, content, and for inline comments: the file path and line numbers. General and inline comments are included.

        EXAMPLES:
        - List all comments on a PR: { workspaceSlug: "my-team", repoSlug: "backend-api", prId: "42" }
        - Paginate results: { workspaceSlug: "my-team", repoSlug: "backend-api", prId: "42", limit: 25, cursor: "next-page-token" }

        ERRORS:
        - Pull Request not found: Verify 'workspaceSlug', 'repoSlug', and 'prId' are correct.
        - Repository not found: Verify 'workspaceSlug' and 'repoSlug'.
        - Permission errors: Ensure access to view the specified pull request comments.`,
		ListPullRequestCommentsToolArgs.shape,
		listPullRequestComments,
	);

	// Register the add pull request comment tool
	server.tool(
		'add_pr_comment',
		`Add a comment to a specific Bitbucket pull request. Requires 'workspaceSlug', 'repoSlug', 'prId', and 'content'.

        PURPOSE: Create comments on a pull request to provide feedback, ask questions, or communicate with other reviewers/developers. Supports both general PR comments and inline code comments.

        WHEN TO USE:
        - To provide feedback on a specific pull request.
        - To add inline comments on specific lines of code.
        - To respond to review feedback or discussions.
        - When you need to add comments programmatically through the API.
        - Requires known 'workspaceSlug', 'repoSlug', and 'prId'.

        WHEN NOT TO USE:
        - When you don't know the pull request ID (use 'list_pull_requests' first).
        - When you need to read existing comments (use 'list_pr_comments').
        - When you need to modify or delete existing comments (not supported).

        RETURNS: Confirmation message indicating the comment was added successfully.

        EXAMPLES:
        - Add a general comment: { workspaceSlug: "my-team", repoSlug: "backend-api", prId: "42", content: "This looks good! Ready to merge." }
        - Add an inline code comment: { workspaceSlug: "my-team", repoSlug: "backend-api", prId: "42", content: "Consider using a constant here.", inline: { path: "src/main.js", line: 42 } }

        ERRORS:
        - Pull Request not found: Verify 'workspaceSlug', 'repoSlug', and 'prId' are correct.
        - Repository not found: Verify 'workspaceSlug' and 'repoSlug'.
        - Permission errors: Ensure access to comment on the specified pull request.`,
		AddPullRequestCommentToolArgs.shape,
		addPullRequestComment,
	);

	methodLogger.debug('Successfully registered Atlassian Pull Requests tools');
}

export default { register };
