import { Command } from 'commander';
import { Logger } from '../utils/logger.util.js';
import { handleCliError } from '../utils/error.util.js';
// Import directly from specialized controllers
import { handleRepositoriesList } from '../controllers/atlassian.repositories.list.controller.js';
import {
	handleCreateBranch,
	handleListBranches,
} from '../controllers/atlassian.repositories.branch.controller.js';
import { handleCloneRepository } from '../controllers/atlassian.repositories.content.controller.js';

/**
 * CLI module for managing Bitbucket repositories.
 * Provides commands for listing repositories and managing branches.
 * Note: Get repository details, commit history, and file content are available via the generic 'get' command.
 * All commands require valid Atlassian credentials.
 */

// Create a contextualized logger for this file
const cliLogger = Logger.forContext('cli/atlassian.repositories.cli.ts');

// Log CLI initialization
cliLogger.debug('Bitbucket repositories CLI module initialized');

/**
 * Register Bitbucket repositories CLI commands with the Commander program
 *
 * @param program - The Commander program instance to register commands with
 * @throws Error if command registration fails
 */
function register(program: Command): void {
	const methodLogger = Logger.forContext(
		'cli/atlassian.repositories.cli.ts',
		'register',
	);
	methodLogger.debug('Registering Bitbucket Repositories CLI commands...');

	registerListRepositoriesCommand(program);
	registerAddBranchCommand(program);
	registerCloneRepositoryCommand(program);
	registerListBranchesCommand(program);

	methodLogger.debug('CLI commands registered successfully');
}

/**
 * Register the command for listing Bitbucket repositories in a workspace
 *
 * @param program - The Commander program instance
 */
function registerListRepositoriesCommand(program: Command): void {
	program
		.command('ls-repos')
		.description(
			'List repositories in a Bitbucket workspace, with filtering and pagination.',
		)
		.option(
			'-w, --workspace-slug <slug>',
			'Workspace slug containing the repositories. If not provided, uses your default workspace (configured via BITBUCKET_DEFAULT_WORKSPACE or first workspace in your account). Example: "myteam"',
		)
		.option(
			'-q, --query <string>',
			'Filter repositories by this query string. Searches repository name and description.',
		)
		.option(
			'-p, --project-key <key>',
			'Filter repositories belonging to the specified project key. Example: "PROJ"',
		)
		.option(
			'-r, --role <string>',
			'Filter repositories where the authenticated user has the specified role or higher. Valid roles: `owner`, `admin`, `contributor`, `member`. Note: `member` typically includes all accessible repositories.',
		)
		.option(
			'-s, --sort <string>',
			'Sort repositories by this field. Examples: "name", "-updated_on" (default), "size".',
		)
		.option(
			'-l, --limit <number>',
			'Maximum number of items to return (1-100). Defaults to 25 if omitted.',
		)
		.option(
			'-c, --cursor <string>',
			'Pagination cursor for retrieving the next set of results.',
		)
		.action(async (options) => {
			const actionLogger = cliLogger.forMethod('ls-repos');
			try {
				actionLogger.debug('CLI ls-repos called', options);

				// Map CLI options to controller options - keep only type conversions
				const controllerOptions = {
					workspaceSlug: options.workspaceSlug,
					query: options.query,
					projectKey: options.projectKey,
					role: options.role,
					sort: options.sort,
					limit: options.limit
						? parseInt(options.limit, 10)
						: undefined,
					cursor: options.cursor,
				};

				// Call controller directly
				const result = await handleRepositoriesList(controllerOptions);

				// Output result content
				console.log(result.content);
			} catch (error) {
				handleCliError(error);
			}
		});
}

/**
 * Register the command for adding a branch to a repository
 * @param program - The Commander program instance
 */
function registerAddBranchCommand(program: Command): void {
	program
		.command('add-branch')
		.description('Add a new branch in a Bitbucket repository.')
		.requiredOption(
			'-w, --workspace-slug <slug>',
			'Workspace slug containing the repository.',
		)
		.requiredOption(
			'-r, --repo-slug <slug>',
			'Repository slug where the branch will be created.',
		)
		.requiredOption(
			'-n, --new-branch-name <n>',
			'The name for the new branch.',
		)
		.requiredOption(
			'-s, --source-branch-or-commit <target>',
			'The name of the existing branch or a full commit hash to branch from.',
		)
		.action(async (options) => {
			const actionLogger = Logger.forContext(
				'cli/atlassian.repositories.cli.ts',
				'add-branch',
			);
			try {
				actionLogger.debug('Processing command options:', options);

				// Map CLI options to controller params
				const requestOptions = {
					workspaceSlug: options.workspaceSlug,
					repoSlug: options.repoSlug,
					newBranchName: options.newBranchName,
					sourceBranchOrCommit: options.sourceBranchOrCommit,
				};

				actionLogger.debug(
					'Creating branch with options:',
					requestOptions,
				);
				const result = await handleCreateBranch(requestOptions);
				actionLogger.debug('Successfully created branch');

				console.log(result.content);
			} catch (error) {
				actionLogger.error('Operation failed:', error);
				handleCliError(error);
			}
		});
}

/**
 * Register the command for cloning a Bitbucket repository.
 *
 * @param program - The Commander program instance
 */
function registerCloneRepositoryCommand(program: Command): void {
	program
		.command('clone')
		.description(
			'Clone a Bitbucket repository to your local filesystem using SSH (preferred) or HTTPS. ' +
				'The repository will be cloned into a subdirectory at targetPath/repoSlug. ' +
				'Requires Bitbucket credentials and proper SSH key setup for optimal usage.',
		)
		.requiredOption(
			'-w, --workspace-slug <slug>',
			'Workspace slug containing the repository. Example: "myteam"',
		)
		.requiredOption(
			'-r, --repo-slug <slug>',
			'Repository slug to clone. Example: "project-api"',
		)
		.requiredOption(
			'-t, --target-path <path>',
			'Directory path where the repository will be cloned. Absolute paths are strongly recommended. Example: "/home/user/projects"',
		)
		.action(async (options) => {
			const actionLogger = Logger.forContext(
				'cli/atlassian.repositories.cli.ts',
				'clone',
			);
			try {
				actionLogger.debug(
					'Processing clone command options:',
					options,
				);

				// Map CLI options to controller params (already correct case)
				const controllerOptions = {
					workspaceSlug: options.workspaceSlug,
					repoSlug: options.repoSlug,
					targetPath: options.targetPath,
				};

				actionLogger.debug(
					'Initiating repository clone with options:',
					controllerOptions,
				);
				const result = await handleCloneRepository(controllerOptions);
				actionLogger.info('Clone operation initiated successfully.');

				console.log(result.content);
			} catch (error) {
				actionLogger.error('Clone operation failed:', error);
				handleCliError(error);
			}
		});
}

/**
 * Register the command for listing branches in a repository
 * @param program - The Commander program instance
 */
function registerListBranchesCommand(program: Command): void {
	program
		.command('list-branches')
		.description('List branches in a Bitbucket repository.')
		.option(
			'-w, --workspace-slug <slug>',
			'Workspace slug containing the repository. If not provided, uses your default workspace. Example: "myteam"',
		)
		.requiredOption(
			'-r, --repo-slug <slug>',
			'Repository slug to list branches from. Example: "project-api"',
		)
		.option(
			'-q, --query <string>',
			'Filter branches by name or other properties (text search).',
		)
		.option(
			'-s, --sort <string>',
			'Sort branches by this field. Examples: "name" (default), "-name", "target.date".',
		)
		.option(
			'-l, --limit <number>',
			'Maximum number of branches to return (1-100). Defaults to 25 if omitted.',
		)
		.option(
			'-c, --cursor <string>',
			'Pagination cursor for retrieving the next set of results.',
		)
		.action(async (options) => {
			const actionLogger = Logger.forContext(
				'cli/atlassian.repositories.cli.ts',
				'list-branches',
			);
			try {
				actionLogger.debug('Processing command options:', options);

				// Map CLI options to controller params - keep only type conversions
				const params = {
					workspaceSlug: options.workspaceSlug,
					repoSlug: options.repoSlug,
					query: options.query,
					sort: options.sort,
					limit: options.limit
						? parseInt(options.limit, 10)
						: undefined,
					cursor: options.cursor,
				};

				actionLogger.debug(
					'Fetching branches with parameters:',
					params,
				);
				const result = await handleListBranches(params);
				actionLogger.debug('Successfully retrieved branches');

				console.log(result.content);
			} catch (error) {
				actionLogger.error('Operation failed:', error);
				handleCliError(error);
			}
		});
}

export default { register };
