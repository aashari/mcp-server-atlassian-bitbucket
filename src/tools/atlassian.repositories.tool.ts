import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Logger } from '../utils/logger.util.js';
import { formatErrorForMcpTool } from '../utils/error.util.js';
import {
	ListRepositoriesToolArgs,
	type ListRepositoriesToolArgsType,
	GetRepositoryToolArgs,
	type GetRepositoryToolArgsType,
	GetCommitHistoryToolArgs,
	type GetCommitHistoryToolArgsType,
	CreateBranchToolArgsSchema,
	type CreateBranchToolArgsType,
	CloneRepositoryToolArgs,
	type CloneRepositoryToolArgsType,
	GetFileContentToolArgs,
	type GetFileContentToolArgsType,
	ListBranchesToolArgs,
	type ListBranchesToolArgsType,
} from './atlassian.repositories.types.js';

// Import directly from specialized controllers
import { handleRepositoriesList } from '../controllers/atlassian.repositories.list.controller.js';
import { handleRepositoryDetails } from '../controllers/atlassian.repositories.details.controller.js';
import { handleCommitHistory } from '../controllers/atlassian.repositories.commit.controller.js';
import {
	handleCreateBranch,
	handleListBranches,
} from '../controllers/atlassian.repositories.branch.controller.js';
import {
	handleCloneRepository,
	handleGetFileContent,
} from '../controllers/atlassian.repositories.content.controller.js';

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
 * MCP Tool: Get Bitbucket Repository Details
 *
 * Retrieves detailed information about a specific Bitbucket repository.
 * Returns a formatted markdown response with repository metadata.
 *
 * @param args - Tool arguments containing the workspace and repository slug
 * @returns MCP response with formatted repository details
 * @throws Will return error message if repository retrieval fails
 */
async function getRepository(args: Record<string, unknown>) {
	const methodLogger = Logger.forContext(
		'tools/atlassian.repositories.tool.ts',
		'getRepository',
	);
	methodLogger.debug('Getting repository details:', args);

	try {
		// Pass args directly to controller
		const result = await handleRepositoryDetails(
			args as GetRepositoryToolArgsType,
		);

		methodLogger.debug(
			'Successfully retrieved repository details from controller',
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
		methodLogger.error('Failed to get repository details', error);
		return formatErrorForMcpTool(error);
	}
}

/**
 * MCP Tool: Get Bitbucket Commit History
 *
 * Retrieves the commit history for a specific repository.
 *
 * @param args Tool arguments including workspace/repo slugs and optional filters.
 * @returns MCP response with formatted commit history.
 * @throws Will return error message if history retrieval fails.
 */
async function handleGetCommitHistory(args: Record<string, unknown>) {
	const methodLogger = Logger.forContext(
		'tools/atlassian.repositories.tool.ts',
		'handleGetCommitHistory',
	);
	methodLogger.debug('Getting commit history with args:', args);

	try {
		// Pass args directly to controller
		const result = await handleCommitHistory(
			args as GetCommitHistoryToolArgsType,
		);

		methodLogger.debug(
			'Successfully retrieved commit history from controller',
		);

		return {
			content: [{ type: 'text' as const, text: result.content }],
		};
	} catch (error) {
		methodLogger.error('Failed to get commit history', error);
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
 * Handler for getting file content.
 */
async function getFileContent(args: Record<string, unknown>) {
	const methodLogger = toolLogger.forMethod('getFileContent');
	try {
		methodLogger.debug('Getting file content:', args);

		// Map tool args to controller args
		const typedArgs = args as GetFileContentToolArgsType;
		const result = await handleGetFileContent({
			workspaceSlug: typedArgs.workspaceSlug,
			repoSlug: typedArgs.repoSlug,
			path: typedArgs.filePath,
			ref: typedArgs.revision,
		});

		methodLogger.debug(
			'Successfully retrieved file content via controller',
		);

		return {
			content: [{ type: 'text' as const, text: result.content }],
		};
	} catch (error) {
		methodLogger.error('Failed to get file content', error);
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

	// Register the get repository details tool
	server.tool(
		'bb_get_repo',
		`Retrieves detailed information for a specific repository identified by \`workspaceSlug\` and \`repoSlug\`. Returns comprehensive repository details as formatted Markdown, including owner, main branch, comment/task counts, recent pull requests, and relevant links. Requires Bitbucket credentials.`,
		GetRepositoryToolArgs.shape,
		getRepository,
	);

	// Register the get commit history tool
	server.tool(
		'bb_get_commit_history',
		`Retrieves the commit history for a repository identified by \`workspaceSlug\` and \`repoSlug\`. Supports pagination via \`limit\` (number of commits per page) and \`cursor\` (which acts as the page number for this endpoint). Optionally filters history starting from a specific branch, tag, or commit hash using \`revision\`, or shows only commits affecting a specific file using \`path\`. Returns the commit history as formatted Markdown, including commit hash, author, date, and message. Pagination details are included at the end of the text content. Requires Bitbucket credentials to be configured.`,
		GetCommitHistoryToolArgs.shape,
		handleGetCommitHistory,
	);

	// Add the new branch tool
	server.tool(
		'bb_add_branch',
		`Creates a new branch in a specified Bitbucket repository. Requires the workspace slug (\`workspaceSlug\`), repository slug (\`repoSlug\`), the desired new branch name (\`newBranchName\`), and the source branch or commit hash (\`sourceBranchOrCommit\`) to branch from. Requires repository write permissions. Returns a success message.

**⚠️ CRITICAL: REQUIRES EXPLICIT USER APPROVAL ⚠️**

This is a WRITE OPERATION that permanently modifies repository data. Before calling this tool, you MUST:

1. Use the AskUserQuestion tool to ask the user for explicit approval
2. Present clear options: "Yes, create the branch" and "No, cancel"
3. Include details: repository name, new branch name, and source branch
4. ONLY call this tool if the user explicitly selects "Yes"

**NEVER call this tool without first using AskUserQuestion to get user approval.** This is a critical safety mechanism to prevent accidental repository modifications.`,
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

	// Register the get file content tool
	server.tool(
		'bb_get_file',
		`Retrieves the content of a file from a Bitbucket repository identified by \`workspaceSlug\` and \`repoSlug\`. Specify the file to retrieve using the \`filePath\` parameter. Optionally, you can specify a \`revision\` (branch name, tag, or commit hash) to retrieve the file from - if omitted, the repository's default branch is used. Returns the raw content of the file as text. Requires Bitbucket credentials.`,
		GetFileContentToolArgs.shape,
		getFileContent,
	);

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
