import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Logger } from '../utils/logger.util.js';

// Create a contextualized logger for this file
const toolLogger = Logger.forContext('tools/atlassian.diff.tool.ts');

// Log tool initialization
toolLogger.debug('Bitbucket diff tool initialized');

/**
 * Register all Bitbucket diff tools with the MCP server.
 *
 * NOTE: bb_diff_branches has been replaced by the generic bb_get tool.
 * Use two separate calls:
 * - Diffstat: bb_get({ path: "/repositories/{workspace}/{repo_slug}/diffstat/{dest}..{source}" })
 * - Raw diff: bb_get({ path: "/repositories/{workspace}/{repo_slug}/diff/{dest}..{source}" })
 *
 * NOTE: bb_diff_commits has been replaced by the generic bb_get tool.
 * Use two separate calls:
 * - Diffstat: bb_get({ path: "/repositories/{workspace}/{repo_slug}/diffstat/{since}..{until}" })
 * - Raw diff: bb_get({ path: "/repositories/{workspace}/{repo_slug}/diff/{since}..{until}" })
 *
 * The spec parameter format is: {base}..{target} (URL-encoded as needed)
 * - For branches: main..feature
 * - For commits: abc123..def456
 */
function registerTools(_server: McpServer) {
	const registerLogger = Logger.forContext(
		'tools/atlassian.diff.tool.ts',
		'registerTools',
	);
	registerLogger.debug(
		'Diff tools deprecated - use bb_get instead. No tools to register.',
	);
}

export default { registerTools };
