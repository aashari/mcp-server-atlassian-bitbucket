import { Command } from 'commander';
import { Logger } from '../utils/logger.util.js';
import { handleCliError } from '../utils/error.util.js';
import atlassianWorkspacesController from '../controllers/atlassian.workspaces.controller.js';

/**
 * CLI module for managing Bitbucket workspaces.
 * Provides commands for listing workspaces.
 * Note: Get workspace details is available via the generic 'get' command.
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

export default { register };
