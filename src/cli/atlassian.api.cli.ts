import { Command } from 'commander';
import { Logger } from '../utils/logger.util.js';
import { handleCliError } from '../utils/error.util.js';
import { handleGet } from '../controllers/atlassian.api.controller.js';

/**
 * CLI module for generic Bitbucket API access.
 * Provides a command for making GET requests to any Bitbucket API endpoint.
 */

// Create a contextualized logger for this file
const cliLogger = Logger.forContext('cli/atlassian.api.cli.ts');

// Log CLI initialization
cliLogger.debug('Bitbucket API CLI module initialized');

/**
 * Register generic Bitbucket API CLI commands with the Commander program
 *
 * @param program - The Commander program instance to register commands with
 */
function register(program: Command): void {
	const methodLogger = Logger.forContext(
		'cli/atlassian.api.cli.ts',
		'register',
	);
	methodLogger.debug('Registering Bitbucket API CLI commands...');

	program
		.command('get')
		.description(
			'Make a GET request to any Bitbucket API endpoint. Returns raw JSON.',
		)
		.requiredOption(
			'-p, --path <path>',
			'API endpoint path (without base URL). Must start with "/". Examples: "/workspaces", "/repositories/{workspace}/{repo_slug}"',
		)
		.option(
			'-q, --query-params <json>',
			'Query parameters as JSON string. Example: \'{"pagelen": "25", "page": "2"}\'',
		)
		.option(
			'--jq <expression>',
			'JMESPath expression to filter/transform the JSON response. Examples: "values[*].name", "size", "{name: name, uuid: uuid}"',
		)
		.action(async (options) => {
			const actionLogger = cliLogger.forMethod('get');
			try {
				actionLogger.debug('CLI get called', options);

				// Parse query params if provided
				let queryParams: Record<string, string> | undefined;
				if (options.queryParams) {
					try {
						queryParams = JSON.parse(options.queryParams);
					} catch {
						throw new Error(
							'Invalid JSON in --query-params. Please provide valid JSON.',
						);
					}
				}

				const result = await handleGet({
					path: options.path,
					queryParams,
					jq: options.jq,
				});

				console.log(result.content);
			} catch (error) {
				handleCliError(error);
			}
		});

	methodLogger.debug('CLI commands registered successfully');
}

export default { register };
