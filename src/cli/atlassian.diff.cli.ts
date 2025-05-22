import { Command } from 'commander';
import { Logger } from '../utils/logger.util.js';
import { handleCliError } from '../utils/error.util.js';
import diffController from '../controllers/atlassian.diff.controller.js';

// Create a contextualized logger for this file
const cliLogger = Logger.forContext('cli/atlassian.diff.cli.ts');

// Log initialization
cliLogger.debug('Bitbucket diff CLI module initialized');

/**
 * Register diff-related CLI commands
 * @param program - Commander instance
 */
function register(program: Command) {
	const registerLogger = cliLogger.forMethod('register');
	registerLogger.debug('Registering Bitbucket Diff CLI commands...');

	// Branch diff command
	program
		.command('diff-branches')
		.description(
			'Display differences between two branches in a repository.\nIMPORTANT: The output shows changes as "destinationBranch → sourceBranch". For complete code changes (not just summary), try reversing the branch parameters if initial results show only summary.',
		)
		.option(
			'-w, --workspace-slug <workspaceSlug>',
			'Workspace slug containing the repository. If not provided, the system will use your default workspace (either configured via BITBUCKET_DEFAULT_WORKSPACE or the first workspace in your account).',
		)
		.requiredOption(
			'-r, --repo-slug <repoSlug>',
			'Repository slug where the branches are located. Example: "my-repo"',
		)
		.requiredOption(
			'-s, --source-branch <sourceBranch>',
			'Name of the source branch (typically your feature branch). Example: "feature/my-feature"',
		)
		.option(
			'-d, --destination-branch <destinationBranch>',
			'Name of the destination branch (typically the main branch). Defaults to "main" if not provided.',
		)
		.option(
			'--full-diff <boolean>',
			'Whether to include the full diff in the response. Defaults to true.',
			(value) => value === 'true',
		)
		.option(
			'-l, --limit <number>',
			'Maximum number of files to show in the diff (1-100). Defaults to 25 if omitted.',
		)
		.option(
			'-p, --page <number>',
			'Page number for pagination. Starts at 1. Use with limit to paginate results.',
		)
		.option(
			'-t, --topic <boolean>',
			'Whether to treat the source ref as a topic branch. Defaults to false.',
			(value) => value === 'true',
		)
		.action(async (options) => {
			const actionLogger = cliLogger.forMethod('diff-branches');
			try {
				actionLogger.debug('Processing command options:', options);

				// Map CLI options to controller params - keep only type conversions
				const controllerOptions = {
					workspaceSlug: options.workspaceSlug,
					repoSlug: options.repoSlug,
					sourceBranch: options.sourceBranch,
					destinationBranch: options.destinationBranch,
					includeFullDiff: options.fullDiff, // Pass the value directly (it will be boolean or undefined)
					limit: options.limit
						? parseInt(options.limit, 10)
						: undefined,
					cursor: options.page
						? parseInt(options.page, 10)
						: undefined,
					topic: options.topic,
				};

				actionLogger.debug(
					'Calling controller with parameters:',
					controllerOptions,
				);

				// Call controller directly
				const result =
					await diffController.branchDiff(controllerOptions);

				console.log(result.content);
			} catch (error) {
				actionLogger.error('Operation failed:', error);
				handleCliError(error);
			}
		});

	// Commit diff command
	program
		.command('diff-commits')
		.description(
			'Display differences between two commits in a repository.\nIMPORTANT: For proper results, the parameter order can matter. If you see "No changes detected", try reversing the commit order.',
		)
		.option(
			'-w, --workspace-slug <workspaceSlug>',
			'Workspace slug containing the repository. If not provided, the system will use your default workspace (either configured via BITBUCKET_DEFAULT_WORKSPACE or the first workspace in your account).',
		)
		.requiredOption(
			'-r, --repo-slug <repoSlug>',
			'Repository slug where the commits are located. Example: "my-repo"',
		)
		.requiredOption(
			'-s, --since-commit <sinceCommit>',
			'Commit hash for the newer/later commit. Example: "a1b2c3d4"',
		)
		.requiredOption(
			'-u, --until-commit <untilCommit>',
			'Commit hash for the older/earlier commit. Example: "e5f6g7h8"',
		)
		.option(
			'--full-diff <boolean>',
			'Whether to include the full diff in the response. Defaults to true.',
			(value) => value === 'true',
		)
		.option(
			'-l, --limit <number>',
			'Maximum number of files to show in the diff (1-100). Defaults to 25 if omitted.',
		)
		.option(
			'-p, --page <number>',
			'Page number for pagination. Starts at 1. Use with limit to paginate results.',
		)
		.action(async (options) => {
			const actionLogger = cliLogger.forMethod('diff-commits');
			try {
				actionLogger.debug('Processing command options:', options);

				// Map CLI options to controller params - keep only type conversions
				const controllerOptions = {
					workspaceSlug: options.workspaceSlug,
					repoSlug: options.repoSlug,
					sinceCommit: options.sinceCommit,
					untilCommit: options.untilCommit,
					includeFullDiff: options.fullDiff, // Pass the value directly (it will be boolean or undefined)
					limit: options.limit
						? parseInt(options.limit, 10)
						: undefined,
					cursor: options.page
						? parseInt(options.page, 10)
						: undefined,
				};

				actionLogger.debug(
					'Calling controller with parameters:',
					controllerOptions,
				);

				// Call controller directly
				const result =
					await diffController.commitDiff(controllerOptions);

				console.log(result.content);
			} catch (error) {
				actionLogger.error('Operation failed:', error);
				handleCliError(error);
			}
		});

	registerLogger.debug('CLI commands registered successfully');
}

export default { register };
