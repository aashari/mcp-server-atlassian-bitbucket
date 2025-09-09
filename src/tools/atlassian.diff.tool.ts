import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Logger } from '../utils/logger.util.js';
import { formatErrorForMcpTool } from '../utils/error.util.js';
import diffController from '../controllers/atlassian.diff.controller.js';
import {
	BranchDiffArgsSchema,
	CommitDiffArgsSchema,
	type BranchDiffArgsType,
	type CommitDiffArgsType,
} from './atlassian.diff.types.js';

// Create a contextualized logger for this file
const toolLogger = Logger.forContext('tools/atlassian.diff.tool.ts');

// Log tool initialization
toolLogger.debug('Bitbucket diff tool initialized');

/**
 * Handles branch diff requests
 * @param args - Arguments for the branch diff operation
 * @returns MCP tool response
 */
async function branchDiff(args: Record<string, unknown>) {
	const methodLogger = toolLogger.forMethod('branchDiff');
	try {
		methodLogger.debug('Processing branch diff tool request', args);

		// Pass args directly to controller without any business logic
		const result = await diffController.branchDiff(
			args as BranchDiffArgsType,
		);

		methodLogger.debug(
			'Successfully retrieved branch diff from controller',
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
		methodLogger.error('Failed to retrieve branch diff', error);
		return formatErrorForMcpTool(error);
	}
}

/**
 * Handles commit diff requests
 * @param args - Arguments for the commit diff operation
 * @returns MCP tool response
 */
async function commitDiff(args: Record<string, unknown>) {
	const methodLogger = toolLogger.forMethod('commitDiff');
	try {
		methodLogger.debug('Processing commit diff tool request', args);

		// Pass args directly to controller without any business logic
		const result = await diffController.commitDiff(
			args as CommitDiffArgsType,
		);

		methodLogger.debug(
			'Successfully retrieved commit diff from controller',
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
		methodLogger.error('Failed to retrieve commit diff', error);
		return formatErrorForMcpTool(error);
	}
}

/**
 * Register all Bitbucket diff tools with the MCP server.
 */
function registerTools(server: McpServer) {
	const registerLogger = Logger.forContext(
		'tools/atlassian.diff.tool.ts',
		'registerTools',
	);
	registerLogger.debug('Registering Diff tools...');

	// Register the branch diff tool
	server.tool(
		'bb_diff_branches',
		`Shows changes between branches in a repository identified by \`workspaceSlug\` and \`repoSlug\`. Compares changes in \`sourceBranch\` relative to \`destinationBranch\`. Limits the number of files to show with \`limit\`. Returns the diff as formatted Markdown showing file changes, additions, and deletions. Requires Bitbucket credentials to be configured.`,
		BranchDiffArgsSchema.shape,
		branchDiff,
	);

	// Register the commit diff tool
	server.tool(
		'bb_diff_commits',
		`Shows changes between commits in a repository identified by \`workspaceSlug\` and \`repoSlug\`. Requires \`sinceCommit\` and \`untilCommit\` to identify the specific commits to compare. Returns the diff as formatted Markdown showing file changes, additions, and deletions between the commits. Requires Bitbucket credentials to be configured.`,
		CommitDiffArgsSchema.shape,
		commitDiff,
	);

	registerLogger.debug('Successfully registered Diff tools');
}

export default { registerTools };
