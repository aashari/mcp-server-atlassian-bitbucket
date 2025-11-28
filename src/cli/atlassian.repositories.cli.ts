import { Command } from 'commander';
import { Logger } from '../utils/logger.util.js';
import { handleCliError } from '../utils/error.util.js';
import { handleCloneRepository } from '../controllers/atlassian.repositories.content.controller.js';

/**
 * CLI module for Bitbucket repository operations.
 * Provides the clone command. Other operations (list repos, branches, etc.)
 * are available via the generic 'get' command.
 */

// Create a contextualized logger for this file
const cliLogger = Logger.forContext('cli/atlassian.repositories.cli.ts');

// Log CLI initialization
cliLogger.debug('Bitbucket repositories CLI module initialized');

/**
 * Register Bitbucket repositories CLI commands with the Commander program
 *
 * @param program - The Commander program instance to register commands with
 */
function register(program: Command): void {
	const methodLogger = Logger.forContext(
		'cli/atlassian.repositories.cli.ts',
		'register',
	);
	methodLogger.debug('Registering Bitbucket Repositories CLI commands...');

	program
		.command('clone')
		.description(
			'Clone a Bitbucket repository to your local filesystem using SSH (preferred) or HTTPS.',
		)
		.requiredOption('-r, --repo-slug <slug>', 'Repository slug to clone.')
		.requiredOption(
			'-t, --target-path <path>',
			'Directory path where the repository will be cloned (absolute path recommended).',
		)
		.option(
			'-w, --workspace-slug <slug>',
			'Workspace slug containing the repository. Uses default workspace if not provided.',
		)
		.action(async (options) => {
			const actionLogger = cliLogger.forMethod('clone');
			try {
				actionLogger.debug(
					'Processing clone command options:',
					options,
				);

				const result = await handleCloneRepository({
					workspaceSlug: options.workspaceSlug,
					repoSlug: options.repoSlug,
					targetPath: options.targetPath,
				});

				console.log(result.content);
			} catch (error) {
				actionLogger.error('Clone operation failed:', error);
				handleCliError(error);
			}
		});

	methodLogger.debug('CLI commands registered successfully');
}

export default { register };
