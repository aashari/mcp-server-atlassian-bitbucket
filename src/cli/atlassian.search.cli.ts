import { Command } from 'commander';
import { Logger } from '../utils/logger.util.js';
import { handleCliError } from '../utils/error.util.js';
import { formatPagination } from '../utils/formatter.util.js';

import atlassianSearchController from '../controllers/atlassian.search.controller.js';

const cliLogger = Logger.forContext('cli/atlassian.search.cli.ts');

/**
 * Register Atlassian Search commands
 *
 * @param {Command} program - Commander program instance
 */
function register(program: Command) {
	const methodLogger = cliLogger.forMethod('register');
	methodLogger.debug('Registering Atlassian search commands...');

	// Register the search command
	program
		.command('search')
		.description(
			'Search for Bitbucket content across repositories, pull requests, commits, and code',
		)
		.requiredOption(
			'-w, --workspace-slug <slug>',
			'Workspace slug containing the content to search',
		)
		.option(
			'-r, --repo-slug <slug>',
			'Repository slug (required for pull request search, optional for code search)',
		)
		.option(
			'-q, --query <query>',
			'Search query to filter results by name, description, etc. (required for code search)',
		)
		.option(
			'-s, --scope <scope>',
			'Search scope: "repositories", "pullrequests", "commits", "code", or "all" (default)',
		)
		.option(
			'-l, --limit <number>',
			'Maximum number of items to return per page (1-100)',
		)
		.option(
			'-c, --cursor <string>',
			'Pagination cursor for repositories/PRs, or page number for code search',
		)
		.action(async (options) => {
			try {
				const actionLogger = cliLogger.forMethod('search');
				actionLogger.debug(
					'Executing search command with options:',
					options,
				);

				// Parse limit as number if provided
				if (options.limit) {
					options.limit = parseInt(options.limit, 10);
				}

				// For code search, cursor is actually a page number
				if (options.scope === 'code' && options.cursor) {
					options.page = parseInt(options.cursor, 10);
				}

				// Map CLI options to controller options
				const controllerOptions = {
					workspaceSlug: options.workspaceSlug,
					repoSlug: options.repoSlug,
					query: options.query,
					scope: options.scope,
					limit: options.limit,
					cursor: options.cursor,
					page: options.page,
				};

				const result =
					await atlassianSearchController.search(controllerOptions);

				console.log(result.content);

				if (result.pagination) {
					console.log(
						formatPagination(
							result.pagination.count || 0,
							result.pagination.hasMore,
							result.pagination.nextCursor,
						),
					);
				}
			} catch (error) {
				handleCliError(error);
			}
		});

	methodLogger.debug('Successfully registered Atlassian search commands');
}

export default { register };
