import { Command } from 'commander';
import { logger } from '../utils/logger.util.js';
import { handleCliError } from '../utils/error.util.js';
import atlassianRepositoriesController from '../controllers/atlassian.repositories.controller.js';
import { ListRepositoriesOptions } from '../controllers/atlassian.repositories.type.js';

/**
 * CLI module for managing Bitbucket repositories.
 * Provides commands for listing repositories and retrieving repository details.
 * All commands require valid Atlassian credentials.
 */

/**
 * Register Bitbucket Repositories CLI commands with the Commander program
 * @param program - The Commander program instance to register commands with
 * @throws Error if command registration fails
 */
function register(program: Command): void {
	const logPrefix = '[src/cli/atlassian.repositories.cli.ts@register]';
	logger.debug(
		`${logPrefix} Registering Bitbucket Repositories CLI commands...`,
	);

	registerListRepositoriesCommand(program);
	registerGetRepositoryCommand(program);

	logger.debug(`${logPrefix} CLI commands registered successfully`);
}

/**
 * Register the command for listing repositories within a workspace
 * @param program - The Commander program instance
 */
function registerListRepositoriesCommand(program: Command): void {
	program
		.command('list-repositories')
		.description(
			'List repositories within a Bitbucket workspace\n\n  Retrieves repositories from the specified workspace with filtering and pagination options.',
		)
		.argument(
			'<workspace>',
			'Workspace slug (e.g., codapayments) to list repositories from',
		)
		.option(
			'-r, --role <role>',
			"Filter by the authenticated user's role on the repositories. Values: owner, admin, contributor, member",
		)
		.option(
			'-f, --filter <filter>',
			'Filter the list by a substring of the name',
		)
		.option(
			'-l, --limit <number>',
			'Maximum number of repositories to return (1-100). Use this to control the response size. If omitted, defaults to 25.',
		)
		.option(
			'-c, --cursor <cursor>',
			'Pagination cursor for retrieving the next set of results. Obtain this value from the previous response when more results are available.',
		)
		.action(async (workspace: string, options) => {
			const logPrefix =
				'[src/cli/atlassian.repositories.cli.ts@list-repositories]';
			try {
				logger.debug(
					`${logPrefix} Processing command options:`,
					options,
				);

				const filterOptions: ListRepositoriesOptions = {
					workspace,
					...(options.role && { role: options.role }),
					...(options.filter && { query: options.filter }),
					...(options.limit && {
						limit: parseInt(options.limit, 10),
					}),
					...(options.cursor && { cursor: options.cursor }),
				};

				logger.debug(
					`${logPrefix} Fetching repositories with filters:`,
					filterOptions,
				);
				const result =
					await atlassianRepositoriesController.list(filterOptions);
				logger.debug(
					`${logPrefix} Successfully retrieved repositories`,
				);

				console.log(result.content);

				// Display pagination information if available
				if (result.pagination?.hasMore) {
					console.log('\n## Pagination');
					console.log(
						`*Showing ${result.pagination.count || ''} items. More results are available.*`,
					);
					console.log(
						`\nTo see more results, use --cursor "${result.pagination.nextCursor}"`,
					);
				}
			} catch (error) {
				logger.error(`${logPrefix} Operation failed:`, error);
				handleCliError(error);
			}
		});
}

/**
 * Register the command for retrieving a specific Bitbucket repository
 * @param program - The Commander program instance
 */
function registerGetRepositoryCommand(program: Command): void {
	program
		.command('get-repository')
		.description(
			'Get detailed information about a specific Bitbucket repository\n\n  Retrieves comprehensive details for a repository including branches, permissions, and settings.',
		)
		.argument('<workspace>', 'Workspace slug containing the repository')
		.argument('<repo-slug>', 'Slug of the repository to retrieve')
		.action(async (workspace: string, repoSlug: string) => {
			const logPrefix =
				'[src/cli/atlassian.repositories.cli.ts@get-repository]';
			try {
				logger.debug(
					`${logPrefix} Fetching details for repository: ${workspace}/${repoSlug}`,
				);
				const result = await atlassianRepositoriesController.get({
					workspace,
					repoSlug,
				});
				logger.debug(
					`${logPrefix} Successfully retrieved repository details`,
				);

				console.log(result.content);
			} catch (error) {
				logger.error(`${logPrefix} Operation failed:`, error);
				handleCliError(error);
			}
		});
}

export default { register };
