import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { logger } from '../utils/logger.util.js';
import { RequestHandlerExtra } from '@modelcontextprotocol/sdk/shared/protocol.js';
import { formatErrorForMcpTool } from '../utils/error.util.js';
import {
	ListPullRequestsToolArgs,
	ListPullRequestsToolArgsType,
	GetPullRequestToolArgs,
	GetPullRequestToolArgsType,
	ListPullRequestCommentsToolArgs,
	ListPullRequestCommentsToolArgsType,
} from './atlassian.pullrequests.types.js';

import atlassianPullRequestsController from '../controllers/atlassian.pullrequests.controller.js';

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
	const logPrefix =
		'[src/tools/atlassian.pullrequests.tool.ts@listPullRequests]';
	logger.debug(
		`${logPrefix} Listing Bitbucket pull requests with filters:`,
		args,
	);

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

		logger.debug(
			`${logPrefix} Successfully retrieved pull requests from controller`,
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
		logger.error(`${logPrefix} Failed to list pull requests`, error);
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
	const logPrefix =
		'[src/tools/atlassian.pullrequests.tool.ts@getPullRequest]';

	logger.debug(
		`${logPrefix} Retrieving pull request details for ${args.workspaceSlug}/${args.repoSlug}/${args.prId}`,
		args,
	);

	try {
		const message = await atlassianPullRequestsController.get({
			workspaceSlug: args.workspaceSlug,
			repoSlug: args.repoSlug,
			prId: args.prId,
		});

		logger.debug(
			`${logPrefix} Successfully retrieved pull request details from controller`,
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
		logger.error(`${logPrefix} Failed to get pull request details`, error);
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
	const logPrefix =
		'[src/tools/atlassian.pullrequests.tool.ts@listPullRequestComments]';

	logger.debug(
		`${logPrefix} Retrieving comments for pull request ${args.workspaceSlug}/${args.repoSlug}/${args.prId}`,
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

		logger.debug(
			`${logPrefix} Successfully retrieved pull request comments from controller`,
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
		logger.error(`${logPrefix} Failed to get pull request comments`, error);
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
	const logPrefix = '[src/tools/atlassian.pullrequests.tool.ts@register]';
	logger.debug(`${logPrefix} Registering Atlassian Pull Requests tools...`);

	// Register the list pull requests tool
	server.tool(
		'list-pull-requests',
		`List pull requests for a specific Bitbucket repository, with optional filtering by state or query text. Requires 'workspaceSlug' and 'repoSlug'.

        PURPOSE: Discover pull requests within a given repository and retrieve their IDs, titles, states, authors, and branches. Essential for finding the 'prId' needed for the 'get-pull-request' tool.

        WHEN TO USE:
        - To find open, merged, declined, or superseded pull requests within a specific repository.
        - To get a list of recent PR activity for a repository.
        - To search for PRs containing specific text in their title or description ('query' parameter).
        - To obtain 'prId' values for use with 'get-pull-request'.
        - Requires known 'workspaceSlug' and 'repoSlug'.

        WHEN NOT TO USE:
        - When you don't know the 'workspaceSlug' or 'repoSlug' (use workspace/repository listing tools first).
        - When you already have the 'prId' and need full details (use 'get-pull-request').
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
		'get-pull-request',
		`Get detailed information about a specific Bitbucket pull request using its workspace slug, repository slug, and pull request ID. Requires 'workspaceSlug', 'repoSlug', and 'prId'.

        PURPOSE: Retrieves comprehensive details for a *known* pull request, including its full description, state, author, reviewers, source/destination branches, and links to related resources like commits and diffs.

        WHEN TO USE:
        - When you need the full context, description, or reviewer list for a *specific* pull request.
        - After using 'list-pull-requests' to identify the target 'prId'.
        - To get links to view the PR diff, commits, or comments in the browser.
        - Requires known 'workspaceSlug', 'repoSlug', and 'prId'.

        WHEN NOT TO USE:
        - When you don't know the 'prId' (use 'list-pull-requests' first).
        - When you only need a list of pull requests (use 'list-pull-requests').
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
		'list-pr-comments',
		`List comments on a specific Bitbucket pull request using its workspace slug, repository slug, and pull request ID. Requires 'workspaceSlug', 'repoSlug', and 'prId'.

        PURPOSE: View all review feedback, discussions, and task comments on a pull request to understand code review context without accessing the web UI.

        WHEN TO USE:
        - When you need to see review feedback for a pull request
        - When you want to view threaded discussions on a PR
        - When you need to see inline code comments and their context
        - After using 'list-pull-requests' to identify the target 'prId'
        - Requires known 'workspaceSlug', 'repoSlug', and 'prId'

        WHEN NOT TO USE:
        - When you don't know the 'prId' (use 'list-pull-requests' first)
        - When you need general PR details (use 'get-pull-request' instead)
        - When you need repository information (use repository tools)

        RETURNS: Formatted list of comments including author, timestamp, content, and inline code context. Both general comments and code-specific comments are included. Supports pagination for PRs with many comments.

        EXAMPLES:
        - Get comments for a specific PR: { workspaceSlug: "my-team", repoSlug: "backend-api", prId: "42" }
        - Paginate results: { workspaceSlug: "my-team", repoSlug: "backend-api", prId: "42", limit: 50, cursor: "next-page-token" }

        ERRORS:
        - Pull Request not found: Verify 'workspaceSlug', 'repoSlug', and 'prId' are correct
        - Repository not found: Verify 'workspaceSlug' and 'repoSlug'
        - Permission errors: Ensure access to view the specified pull request comments`,
		ListPullRequestCommentsToolArgs.shape,
		listPullRequestComments,
	);

	logger.debug(
		`${logPrefix} Successfully registered Atlassian Pull Requests tools`,
	);
}

export default { register };
