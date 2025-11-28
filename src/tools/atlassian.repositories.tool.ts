import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Logger } from '../utils/logger.util.js';
import { formatErrorForMcpTool } from '../utils/error.util.js';
import {
	CreateBranchToolArgsSchema,
	type CreateBranchToolArgsType,
	CloneRepositoryToolArgs,
	type CloneRepositoryToolArgsType,
} from './atlassian.repositories.types.js';

// Import directly from specialized controllers
import { handleCreateBranch } from '../controllers/atlassian.repositories.branch.controller.js';
import { handleCloneRepository } from '../controllers/atlassian.repositories.content.controller.js';

// Create a contextualized logger for this file
const toolLogger = Logger.forContext('tools/atlassian.repositories.tool.ts');

// Log tool initialization
toolLogger.debug('Bitbucket repositories tool initialized');

/**
 * Handler for adding a new branch.
 */
async function handleAddBranch(args: Record<string, unknown>) {
	const methodLogger = Logger.forContext(
		'tools/atlassian.repositories.tool.ts',
		'handleAddBranch',
	);
	try {
		methodLogger.debug('Creating new branch:', args);

		// Pass args directly to controller
		const result = await handleCreateBranch(
			args as CreateBranchToolArgsType,
		);

		methodLogger.debug('Successfully created branch via controller');

		return {
			content: [{ type: 'text' as const, text: result.content }],
		};
	} catch (error) {
		methodLogger.error('Failed to create branch', error);
		return formatErrorForMcpTool(error);
	}
}

/**
 * Handler for cloning a repository.
 */
async function handleRepoClone(args: Record<string, unknown>) {
	const methodLogger = Logger.forContext(
		'tools/atlassian.repositories.tool.ts',
		'handleRepoClone',
	);
	try {
		methodLogger.debug('Cloning repository:', args);

		// Pass args directly to controller
		const result = await handleCloneRepository(
			args as CloneRepositoryToolArgsType,
		);

		methodLogger.debug('Successfully cloned repository via controller');

		return {
			content: [{ type: 'text' as const, text: result.content }],
		};
	} catch (error) {
		methodLogger.error('Failed to clone repository', error);
		return formatErrorForMcpTool(error);
	}
}

/**
 * Register all Bitbucket repository tools with the MCP server.
 *
 * NOTE: bb_ls_repos has been replaced by the generic bb_get tool.
 * Use: bb_get({ path: "/repositories/{workspace}" })
 *
 * NOTE: bb_list_branches has been replaced by the generic bb_get tool.
 * Use: bb_get({ path: "/repositories/{workspace}/{repo_slug}/refs/branches" })
 *
 * NOTE: bb_get_repo has been replaced by the generic bb_get tool.
 * Use: bb_get({ path: "/repositories/{workspace}/{repo_slug}" })
 *
 * NOTE: bb_get_commit_history has been replaced by the generic bb_get tool.
 * Use: bb_get({ path: "/repositories/{workspace}/{repo_slug}/commits" })
 *
 * NOTE: bb_get_file has been replaced by the generic bb_get tool.
 * Use: bb_get({ path: "/repositories/{workspace}/{repo_slug}/src/{commit}/{path}" })
 */
function registerTools(server: McpServer) {
	const registerLogger = Logger.forContext(
		'tools/atlassian.repositories.tool.ts',
		'registerTools',
	);
	registerLogger.debug('Registering Repository tools...');

	// Add the new branch tool
	server.tool(
		'bb_add_branch',
		`Creates a new branch in a specified Bitbucket repository. Requires the workspace slug (\`workspaceSlug\`), repository slug (\`repoSlug\`), the desired new branch name (\`newBranchName\`), and the source branch or commit hash (\`sourceBranchOrCommit\`) to branch from. Requires repository write permissions. Returns a success message.`,
		CreateBranchToolArgsSchema.shape,
		handleAddBranch,
	);

	// Register the clone repository tool
	server.tool(
		'bb_clone_repo',
		`Clones a Bitbucket repository to your local filesystem using SSH (preferred) or HTTPS. Requires Bitbucket credentials and proper SSH key setup for optimal usage.

**Parameters:**
- \`workspaceSlug\`: The Bitbucket workspace containing the repository (optional - will use default if not provided)
- \`repoSlug\`: The repository name to clone (required)
- \`targetPath\`: Parent directory where repository will be cloned (required)

**Path Handling:**
- Absolute paths are strongly recommended (e.g., "/home/user/projects" or "C:\\Users\\name\\projects")
- Relative paths (e.g., "./my-repos" or "../downloads") will be resolved relative to the server's working directory, which may not be what you expect
- The repository will be cloned into a subdirectory at \`targetPath/repoSlug\`
- Make sure you have write permissions to the target directory

**SSH Requirements:**
- SSH keys must be properly configured for Bitbucket
- SSH agent should be running with your keys added
- Will automatically fall back to HTTPS if SSH is unavailable

**Example Usage:**
\`\`\`
// Clone a repository to a specific absolute path
bb_clone_repo({repoSlug: "my-project", targetPath: "/home/user/projects"})

// Specify the workspace and use a relative path (less reliable)
bb_clone_repo({workspaceSlug: "my-team", repoSlug: "api-service", targetPath: "./downloads"})
\`\`\`

**Returns:** Success message with clone details or an error message with troubleshooting steps.`,
		CloneRepositoryToolArgs.shape,
		handleRepoClone,
	);

	registerLogger.debug('Successfully registered Repository tools');
}

export default { registerTools };
