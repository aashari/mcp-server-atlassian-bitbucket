import { Command } from 'commander';
import { Logger } from '../utils/logger.util.js';
import atlassianSearchController from '../controllers/atlassian.search.controller.js';
import { handleCliError } from '../utils/error-handler.util.js';

// Set up a logger for this module
const logger = Logger.forContext('cli/atlassian.search.cli.ts');

/**
 * Register the search commands with the CLI
 * @param program The commander program to register commands with
 */
function register(program: Command) {
	program
		.command('search')
		.description('Search Bitbucket for content matching a query')
		.requiredOption('-q, --query <query>', 'Search query')
		.option('-w, --workspace <workspace>', 'Workspace slug')
		.option('-r, --repo <repo>', 'Repository slug (required for PR search)')
		.option(
			'-t, --type <type>',
			'Search type (code, content, repositories, pullrequests)',
			'code',
		)
		.option(
			'-c, --content-type <contentType>',
			'Content type for content search (e.g., wiki, issue)',
		)
		.option(
			'-l, --language <language>',
			'Filter code search by programming language',
		)
		.option(
			'-e, --extension <extension>',
			'Filter code search by file extension',
		)
		.option('--limit <limit>', 'Maximum number of results to return', '20')
		.option('--cursor <cursor>', 'Pagination cursor')
		.action(async (options) => {
			const methodLogger = logger.forMethod('search');
			try {
				methodLogger.debug('CLI search command called with:', options);

				// Prepare controller options
				// The controller now handles default workspace logic
				const controllerOptions = {
					workspaceSlug: options.workspace,
					repoSlug: options.repo,
					query: options.query,
					scope: options.type,
					contentType: options.contentType,
					language: options.language,
					extension: options.extension,
					limit: options.limit
						? parseInt(options.limit, 10)
						: undefined,
					cursor: options.cursor,
				};

				// Call the controller
				const result =
					await atlassianSearchController.search(controllerOptions);

				// Output the result
				console.log(result.content);
			} catch (error) {
				handleCliError(error);
			}
		});
}

export default { register };
