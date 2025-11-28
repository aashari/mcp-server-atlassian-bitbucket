import { Command } from 'commander';
import { Logger } from '../utils/logger.util.js';
import { handleCliError } from '../utils/error.util.js';
import atlassianWorkspacesController from '../controllers/atlassian.workspaces.controller.js';

/**
 * CLI module for managing Bitbucket workspaces.
 * Provides commands for listing workspaces and retrieving workspace details.
 * All commands require valid Atlassian credentials.
 */

// Create a contextualized logger for this file
const cliLogger = Logger.forContext('cli/atlassian.workspaces.cli.ts');

// Log CLI initialization
cliLogger.debug('Bitbucket workspaces CLI module initialized');

/**
 * Register Bitbucket workspaces CLI commands with the Commander program
 *
 * @param program - The Commander program instance to register commands with
 * @throws Error if command registration fails
 */
function register(program: Command): void {
	const methodLogger = Logger.forContext(
		'cli/atlassian.workspaces.cli.ts',
		'register',
	);
	methodLogger.debug('Registering Bitbucket Workspaces CLI commands...');

	registerListWorkspacesCommand(program);
	registerGetWorkspaceCommand(program);

	methodLogger.debug('CLI commands registered successfully');
}

/**
 * Register the command for listing Bitbucket workspaces
 *
 * @param program - The Commander program instance
 */
function registerListWorkspacesCommand(program: Command): void {
	program
		.command('ls-workspaces')
		.description('List workspaces in your Bitbucket account.')
		.option(
			'-l, --limit <number>',
			'Maximum number of workspaces to retrieve (1-100). Default: 25.',
		)
		.option(
			'-c, --cursor <string>',
			'Pagination cursor for retrieving the next set of results.',
		)
		.action(async (options) => {
			const actionLogger = cliLogger.forMethod('ls-workspaces');
			try {
				actionLogger.debug('Processing command options:', options);

				// Map CLI options to controller params - keep only type conversions
				const controllerOptions = {
					limit: options.limit
						? parseInt(options.limit, 10)
						: undefined,
					cursor: options.cursor,
				};

				// Call controller directly
				const result =
					await atlassianWorkspacesController.list(controllerOptions);

				console.log(result.content);
			} catch (error) {
				actionLogger.error('Operation failed:', error);
				handleCliError(error);
			}
		});
}

/**
 * Register the command for retrieving a specific Bitbucket workspace
 *
 * @param program - The Commander program instance
 */
function registerGetWorkspaceCommand(program: Command): void {
	program
		.command('get-workspace')
		.description(
			'Get detailed information about a specific Bitbucket workspace. Returns raw JSON.',
		)
		.requiredOption(
			'-w, --workspace-slug <slug>',
			'Workspace slug to retrieve. Must be a valid workspace slug from your Bitbucket account. Example: "myteam"',
		)
		.option(
			'--jq <expression>',
			'JMESPath expression to filter/transform the JSON response. Examples: "name", "links.html.href", "{name: name, slug: slug}"',
		)
		.action(async (options) => {
			const actionLogger = Logger.forContext(
				'cli/atlassian.workspaces.cli.ts',
				'get-workspace',
			);
			try {
				actionLogger.debug(
					`Fetching workspace: ${options.workspaceSlug}`,
				);

				// Call controller directly with passed options
				const result = await atlassianWorkspacesController.get({
					workspaceSlug: options.workspaceSlug,
					jq: options.jq,
				});

				console.log(result.content);
			} catch (error) {
				actionLogger.error('Operation failed:', error);
				handleCliError(error);
			}
		});
}

export default { register };
