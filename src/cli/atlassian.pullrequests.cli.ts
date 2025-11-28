import { Command } from 'commander';
import { Logger } from '../utils/logger.util.js';
import { handleCliError } from '../utils/error.util.js';
import atlassianPullRequestsController from '../controllers/atlassian.pullrequests.controller.js';

/**
 * CLI module for managing Bitbucket pull requests.
 * Provides commands for listing, retrieving, and manipulating pull requests.
 * All commands require valid Atlassian credentials.
 */

// Create a contextualized logger for this file
const cliLogger = Logger.forContext('cli/atlassian.pullrequests.cli.ts');

// Log CLI initialization
cliLogger.debug('Bitbucket pull requests CLI module initialized');

/**
 * Register Bitbucket pull requests CLI commands with the Commander program
 * @param program - The Commander program instance to register commands with
 * @throws Error if command registration fails
 */
function register(program: Command): void {
	const methodLogger = Logger.forContext(
		'cli/atlassian.pullrequests.cli.ts',
		'register',
	);
	methodLogger.debug('Registering Bitbucket Pull Requests CLI commands...');

	registerListPullRequestsCommand(program);
	// Note: get-pr has been replaced by the generic 'get' command
	// Use: get --path "/repositories/{workspace}/{repo_slug}/pullrequests/{pr_id}"
	registerListPullRequestCommentsCommand(program);
	registerAddPullRequestCommentCommand(program);
	registerAddPullRequestCommand(program);
	registerUpdatePullRequestCommand(program);
	registerApprovePullRequestCommand(program);
	registerRejectPullRequestCommand(program);

	methodLogger.debug('CLI commands registered successfully');
}

/**
 * Register the command for listing Bitbucket pull requests
 * @param program - The Commander program instance
 */
function registerListPullRequestsCommand(program: Command): void {
	program
		.command('ls-prs')
		.description(
			'List pull requests in a Bitbucket repository, with filtering and pagination.',
		)
		.option(
			'-w, --workspace-slug <slug>',
			'Workspace slug containing the repository. If not provided, the system will use your default workspace (either configured via BITBUCKET_DEFAULT_WORKSPACE or the first workspace in your account). Example: "myteam"',
		)
		.requiredOption(
			'-r, --repo-slug <slug>',
			'Repository slug containing the pull requests. This must be a valid repository in the specified workspace. Example: "project-api"',
		)
		.option(
			'-s, --state <state>',
			'Filter by pull request state: "OPEN", "MERGED", "DECLINED", or "SUPERSEDED". If omitted, returns pull requests in all states.',
		)
		.option(
			'-q, --query <string>',
			'Filter pull requests by query string. Searches pull request title and description.',
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
			const actionLogger = Logger.forContext(
				'cli/atlassian.pullrequests.cli.ts',
				'ls-prs',
			);
			try {
				actionLogger.debug('Processing command options:', options);

				// Map CLI options to controller params - keep only type conversions
				const filterOptions = {
					workspaceSlug: options.workspaceSlug,
					repoSlug: options.repoSlug,
					state: options.state as
						| 'OPEN'
						| 'MERGED'
						| 'DECLINED'
						| 'SUPERSEDED'
						| undefined,
					query: options.query,
					limit: options.limit
						? parseInt(options.limit, 10)
						: undefined,
					cursor: options.cursor,
				};

				actionLogger.debug(
					'Fetching pull requests with filters:',
					filterOptions,
				);
				const result =
					await atlassianPullRequestsController.list(filterOptions);
				actionLogger.debug('Successfully retrieved pull requests');

				// Display the content which now includes pagination information
				console.log(result.content);
			} catch (error) {
				actionLogger.error('Operation failed:', error);
				handleCliError(error);
			}
		});
}

// Note: registerGetPullRequestCommand has been replaced by the generic 'get' command
// Use: get --path "/repositories/{workspace}/{repo_slug}/pullrequests/{pr_id}"

/**
 * Register the command for listing comments on a Bitbucket pull request
 * @param program - The Commander program instance
 */
function registerListPullRequestCommentsCommand(program: Command): void {
	program
		.command('ls-pr-comments')
		.description(
			'List comments on a specific Bitbucket pull request, with pagination.',
		)
		.option(
			'-w, --workspace-slug <slug>',
			'Workspace slug containing the repository. If not provided, uses your default workspace. Example: "myteam"',
		)
		.requiredOption(
			'-r, --repo-slug <slug>',
			'Repository slug containing the pull request. Must be a valid repository in the specified workspace. Example: "project-api"',
		)
		.requiredOption(
			'-p, --pr-id <id>',
			'Numeric ID of the pull request to retrieve comments from. Must be a valid pull request ID in the specified repository. Example: "42"',
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
			const actionLogger = Logger.forContext(
				'cli/atlassian.pullrequests.cli.ts',
				'ls-pr-comments',
			);
			try {
				actionLogger.debug('Processing command options:', options);

				// Map CLI options to controller params - keep only type conversions
				const params = {
					workspaceSlug: options.workspaceSlug,
					repoSlug: options.repoSlug,
					prId: options.prId,
					limit: options.limit
						? parseInt(options.limit, 10)
						: undefined,
					cursor: options.cursor,
				};

				actionLogger.debug('Fetching pull request comments:', params);
				const result =
					await atlassianPullRequestsController.listComments(params);
				actionLogger.debug(
					'Successfully retrieved pull request comments',
				);

				// Display the content which now includes pagination information
				console.log(result.content);
			} catch (error) {
				actionLogger.error('Operation failed:', error);
				handleCliError(error);
			}
		});
}

/**
 * Register the command for adding a comment to a pull request
 * @param program - The Commander program instance
 */
function registerAddPullRequestCommentCommand(program: Command): void {
	program
		.command('add-pr-comment')
		.description('Add a comment to a Bitbucket pull request.')
		.option(
			'-w, --workspace-slug <slug>',
			'Workspace slug containing the repository. If not provided, uses your default workspace. Example: "myteam"',
		)
		.requiredOption(
			'-r, --repo-slug <slug>',
			'Repository slug containing the pull request. Must be a valid repository in the specified workspace. Example: "project-api"',
		)
		.requiredOption(
			'-p, --pr-id <id>',
			'Numeric ID of the pull request to add a comment to. Must be a valid pull request ID in the specified repository. Example: "42"',
		)
		.requiredOption(
			'-m, --content <text>',
			'The content of the comment to add to the pull request. Can include markdown formatting.',
		)
		.option(
			'-f, --path <file-path>',
			'Optional: The file path to add an inline comment to.',
		)
		.option(
			'-L, --line <line-number>',
			'Optional: The line number to add the inline comment to.',
			parseInt,
		)
		.option(
			'--parent-id <id>',
			'Optional: The ID of the parent comment to reply to. If provided, this comment will be a reply to the specified comment.',
		)
		.action(async (options) => {
			const actionLogger = Logger.forContext(
				'cli/atlassian.pullrequests.cli.ts',
				'add-pr-comment',
			);
			try {
				actionLogger.debug('Processing command options:', options);

				// Build parameters object
				const params: {
					workspaceSlug?: string;
					repoSlug: string;
					prId: string;
					content: string;
					inline?: {
						path: string;
						line: number;
					};
					parentId?: string;
				} = {
					workspaceSlug: options.workspaceSlug,
					repoSlug: options.repoSlug,
					prId: options.prId,
					content: options.content,
				};

				// Add inline comment details if both path and line are provided
				if (options.path && options.line) {
					params.inline = {
						path: options.path,
						line: options.line,
					};
				} else if (options.path || options.line) {
					throw new Error(
						'Both -f/--path and -L/--line are required for inline comments',
					);
				}

				// Add parent ID if provided
				if (options.parentId) {
					params.parentId = options.parentId;
				}

				actionLogger.debug('Creating pull request comment:', {
					...params,
					content: '(content length: ' + options.content.length + ')',
				});
				const result =
					await atlassianPullRequestsController.addComment(params);
				actionLogger.debug('Successfully created pull request comment');

				console.log(result.content);
			} catch (error) {
				actionLogger.error('Operation failed:', error);
				handleCliError(error);
			}
		});
}

/**
 * Register the command for adding a new pull request
 * @param program - The Commander program instance
 */
function registerAddPullRequestCommand(program: Command): void {
	program
		.command('add-pr')
		.description('Add a new pull request in a Bitbucket repository.')
		.option(
			'-w, --workspace-slug <slug>',
			'Workspace slug containing the repository. If not provided, uses your default workspace. Example: "myteam"',
		)
		.requiredOption(
			'-r, --repo-slug <slug>',
			'Repository slug to create the pull request in. Must be a valid repository in the specified workspace. Example: "project-api"',
		)
		.requiredOption(
			'-t, --title <title>',
			'Title for the pull request. Example: "Add new feature"',
		)
		.requiredOption(
			'-s, --source-branch <branch>',
			'Source branch name (the branch containing your changes). Example: "feature/new-login"',
		)
		.option(
			'-d, --destination-branch <branch>',
			'Destination branch name (the branch you want to merge into, defaults to main). Example: "develop"',
		)
		.option(
			'--description <text>',
			'Optional description for the pull request.',
		)
		.option(
			'--close-source-branch',
			'Whether to close the source branch after the pull request is merged. Default: false',
			false,
		)
		.action(async (options) => {
			const actionLogger = Logger.forContext(
				'cli/atlassian.pullrequests.cli.ts',
				'add-pr',
			);
			try {
				actionLogger.debug('Processing command options:', options);

				// Map CLI options to controller params
				const params = {
					workspaceSlug: options.workspaceSlug,
					repoSlug: options.repoSlug,
					title: options.title,
					sourceBranch: options.sourceBranch,
					destinationBranch: options.destinationBranch,
					description: options.description,
					closeSourceBranch: options.closeSourceBranch,
				};

				actionLogger.debug('Creating pull request:', {
					...params,
					description: options.description
						? '(description provided)'
						: '(no description)',
				});
				const result =
					await atlassianPullRequestsController.add(params);
				actionLogger.debug('Successfully created pull request');

				console.log(result.content);
			} catch (error) {
				actionLogger.error('Operation failed:', error);
				handleCliError(error);
			}
		});
}

/**
 * Register the command for updating a Bitbucket pull request
 * @param program - The Commander program instance
 */
function registerUpdatePullRequestCommand(program: Command): void {
	program
		.command('update-pr')
		.description(
			'Update an existing pull request in a Bitbucket repository.',
		)
		.option(
			'-w, --workspace-slug <slug>',
			'Workspace slug containing the repository (optional, uses default workspace if not provided). Example: "myteam"',
		)
		.requiredOption(
			'-r, --repo-slug <slug>',
			'Repository slug containing the pull request. Example: "project-api"',
		)
		.requiredOption(
			'-p, --pull-request-id <id>',
			'Pull request ID to update. Example: 123',
			parseInt,
		)
		.option(
			'-t, --title <title>',
			'Updated title for the pull request. Example: "Updated Feature Implementation"',
		)
		.option(
			'--description <text>',
			'Updated description for the pull request.',
		)
		.action(async (options) => {
			const actionLogger = Logger.forContext(
				'cli/atlassian.pullrequests.cli.ts',
				'update-pr',
			);
			try {
				actionLogger.debug('Processing command options:', options);

				// Validate that at least one field to update is provided
				if (!options.title && !options.description) {
					throw new Error(
						'At least one field to update (title or description) must be provided',
					);
				}

				// Map CLI options to controller params
				const params = {
					workspaceSlug: options.workspaceSlug,
					repoSlug: options.repoSlug,
					pullRequestId: options.pullRequestId,
					title: options.title,
					description: options.description,
				};

				actionLogger.debug('Updating pull request:', {
					...params,
					description: options.description
						? '(description provided)'
						: '(no description)',
				});
				const result =
					await atlassianPullRequestsController.update(params);
				actionLogger.debug('Successfully updated pull request');

				console.log(result.content);
			} catch (error) {
				actionLogger.error('Operation failed:', error);
				handleCliError(error);
			}
		});
}

/**
 * Register the command for approving a Bitbucket pull request
 * @param program - The Commander program instance
 */
function registerApprovePullRequestCommand(program: Command): void {
	program
		.command('approve-pr')
		.description('Approve a pull request in a Bitbucket repository.')
		.option(
			'-w, --workspace-slug <slug>',
			'Workspace slug containing the repository (optional, uses default workspace if not provided). Example: "myteam"',
		)
		.requiredOption(
			'-r, --repo-slug <slug>',
			'Repository slug containing the pull request. Example: "project-api"',
		)
		.requiredOption(
			'-p, --pull-request-id <id>',
			'Pull request ID to approve. Example: 123',
			parseInt,
		)
		.action(async (options) => {
			const actionLogger = Logger.forContext(
				'cli/atlassian.pullrequests.cli.ts',
				'approve-pr',
			);
			try {
				actionLogger.debug('Processing command options:', options);

				// Map CLI options to controller params
				const params = {
					workspaceSlug: options.workspaceSlug,
					repoSlug: options.repoSlug,
					pullRequestId: options.pullRequestId,
				};

				actionLogger.debug('Approving pull request:', params);
				const result =
					await atlassianPullRequestsController.approve(params);
				actionLogger.debug('Successfully approved pull request');

				console.log(result.content);
			} catch (error) {
				actionLogger.error('Operation failed:', error);
				handleCliError(error);
			}
		});
}

/**
 * Register the command for requesting changes on a Bitbucket pull request
 * @param program - The Commander program instance
 */
function registerRejectPullRequestCommand(program: Command): void {
	program
		.command('reject-pr')
		.description(
			'Request changes on a pull request in a Bitbucket repository.',
		)
		.option(
			'-w, --workspace-slug <slug>',
			'Workspace slug containing the repository (optional, uses default workspace if not provided). Example: "myteam"',
		)
		.requiredOption(
			'-r, --repo-slug <slug>',
			'Repository slug containing the pull request. Example: "project-api"',
		)
		.requiredOption(
			'-p, --pull-request-id <id>',
			'Pull request ID to request changes on. Example: 123',
			parseInt,
		)
		.action(async (options) => {
			const actionLogger = Logger.forContext(
				'cli/atlassian.pullrequests.cli.ts',
				'reject-pr',
			);
			try {
				actionLogger.debug('Processing command options:', options);

				// Map CLI options to controller params
				const params = {
					workspaceSlug: options.workspaceSlug,
					repoSlug: options.repoSlug,
					pullRequestId: options.pullRequestId,
				};

				actionLogger.debug(
					'Requesting changes on pull request:',
					params,
				);
				const result =
					await atlassianPullRequestsController.reject(params);
				actionLogger.debug(
					'Successfully requested changes on pull request',
				);

				console.log(result.content);
			} catch (error) {
				actionLogger.error('Operation failed:', error);
				handleCliError(error);
			}
		});
}

export default { register };
