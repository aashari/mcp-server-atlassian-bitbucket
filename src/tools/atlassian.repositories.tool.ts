import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Logger } from '../utils/logger.util.js';
import { formatErrorForMcpTool } from '../utils/error.util.js';
import {
	ListRepositoriesToolArgs,
	type ListRepositoriesToolArgsType,
	CreateBranchToolArgsSchema,
	type CreateBranchToolArgsType,
	CloneRepositoryToolArgs,
	type CloneRepositoryToolArgsType,
	ListBranchesToolArgs,
	type ListBranchesToolArgsType,
} from './atlassian.repositories.types.js';

// Import directly from specialized controllers
import { handleRepositoriesList } from '../controllers/atlassian.repositories.list.controller.js';
import {
	handleCreateBranch,
	handleListBranches,
} from '../controllers/atlassian.repositories.branch.controller.js';
import { handleCloneRepository } from '../controllers/atlassian.repositories.content.controller.js';

// Create a contextualized logger for this file
const toolLogger = Logger.forContext('tools/atlassian.repositories.tool.ts');

// Log tool initialization
toolLogger.debug('Bitbucket repositories tool initialized');

/**
 * MCP Tool: List Bitbucket Repositories
 *
 * Lists Bitbucket repositories within a workspace with optional filtering.
 * Returns a formatted markdown response with repository details.
 *
 * @param args - Tool arguments for filtering repositories
 * @returns MCP response with formatted repositories list
 * @throws Will return error message if repository listing fails
 */
async function listRepositories(args: Record<string, unknown>) {
	const methodLogger = Logger.forContext(
		'tools/atlassian.repositories.tool.ts',
		'listRepositories',
	);
	methodLogger.debug('Listing Bitbucket repositories with filters:', args);

	try {
		// Pass args directly to controller without any logic
		const result = await handleRepositoriesList(
			args as ListRepositoriesToolArgsType,
		);

		methodLogger.debug(
			'Successfully retrieved repositories from controller',
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
		methodLogger.error('Failed to list repositories', error);
		return formatErrorForMcpTool(error);
	}
}

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
 * MCP Tool: List Branches in a Bitbucket Repository
 *
 * Lists branches within a specific repository with optional filtering.
 * Returns a formatted markdown response with branch details.
 *
 * @param args - Tool arguments for identifying the repository and filtering branches
 * @returns MCP response with formatted branches list
 * @throws Will return error message if branch listing fails
 */
async function listBranches(args: Record<string, unknown>) {
	const methodLogger = Logger.forContext(
		'tools/atlassian.repositories.tool.ts',
		'listBranches',
	);
	methodLogger.debug('Listing branches with filters:', args);

	try {
		// Pass args directly to controller
		const result = await handleListBranches(
			args as ListBranchesToolArgsType,
		);

		methodLogger.debug('Successfully retrieved branches from controller');

		return {
			content: [
				{
					type: 'text' as const,
					text: result.content,
				},
			],
		};
	} catch (error) {
		methodLogger.error('Failed to list branches', error);
		return formatErrorForMcpTool(error);
	}
}

/**
 * Register all Bitbucket repository tools with the MCP server.
 */
function registerTools(server: McpServer) {
	const registerLogger = Logger.forContext(
		'tools/atlassian.repositories.tool.ts',
		'registerTools',
	);
	registerLogger.debug('Registering Repository tools...');

	// Register the list repositories tool
	server.tool(
		'bb_ls_repos',
		`Lists repositories within a workspace. If \`workspaceSlug\` is not provided, uses your default workspace (either configured via BITBUCKET_DEFAULT_WORKSPACE or the first workspace in your account). Filters repositories by the user\`s \`role\`, project key \`projectKey\`, or a \`query\` string (searches name/description). Supports sorting via \`sort\` and pagination via \`limit\` and \`cursor\`. Pagination details are included at the end of the text content. Returns a formatted Markdown list with comprehensive details. Requires Bitbucket credentials.`,
		ListRepositoriesToolArgs.shape,
		listRepositories,
	);

	// Note: bb_get_repo has been replaced by the generic bb_get tool
	// Use: bb_get({ path: "/repositories/{workspace}/{repo_slug}" })

	// Note: bb_get_commit_history has been replaced by the generic bb_get tool
	// Use: bb_get({ path: "/repositories/{workspace}/{repo_slug}/commits" })

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

	// Note: bb_get_file has been replaced by the generic bb_get tool
	// Use: bb_get({ path: "/repositories/{workspace}/{repo_slug}/src/{commit}/{path}" })

	// Register the list branches tool
	server.tool(
		'bb_list_branches',
		`Lists branches in a repository identified by \`workspaceSlug\` and \`repoSlug\`. Filters branches by an optional text \`query\` and supports custom \`sort\` order. Provides pagination via \`limit\` and \`cursor\`. Pagination details are included at the end of the text content. Returns branch details as Markdown with each branch's name, latest commit, and default merge strategy. Requires Bitbucket credentials.`,
		ListBranchesToolArgs.shape,
		listBranches,
	);

	registerLogger.debug('Successfully registered Repository tools');
}

export default { registerTools };
