import atlassianIssuesController from './atlassian.issues.controller.js';
import { getAtlassianCredentials } from '../utils/transport.util.js';
import { config } from '../utils/config.util.js';
import { McpError } from '../utils/error.util.js';
import atlassianWorkspacesService from '../services/vendor.atlassian.workspaces.service.js';
import atlassianRepositoriesService from '../services/vendor.atlassian.repositories.service.js';
import atlassianIssuesService from '../services/vendor.atlassian.issues.service.js';
import { Logger } from '../utils/logger.util.js';

// Instantiate logger for the test file
const logger = Logger.forContext(
	'controllers/atlassian.issues.controller.test.ts',
);

describe('Atlassian Issues Controller', () => {
	// Load configuration and check for credentials before all tests
	beforeAll(() => {
		config.load(); // Ensure config is loaded
		const credentials = getAtlassianCredentials();
		if (!credentials) {
			console.warn(
				'Skipping Atlassian Issues Controller tests: No credentials available',
			);
		}
	});

	// Helper function to skip tests when credentials are missing
	const skipIfNoCredentials = () => !getAtlassianCredentials();

	// Helper to get a valid workspace and repository for testing
	async function getWorkspaceAndRepo(): Promise<{
		workspaceSlug: string;
		repoSlug: string;
	} | null> {
		if (skipIfNoCredentials()) return null;

		try {
			// Get first workspace
			const workspacesResult = await atlassianWorkspacesService.list({
				pagelen: 1,
			});
			if (workspacesResult.values.length === 0) {
				console.warn('No workspaces found');
				return null;
			}
			const workspaceSlug = workspacesResult.values[0].workspace.slug;

			// Get first repository in workspace
			const reposResult = await atlassianRepositoriesService.list({
				workspace: workspaceSlug,
				pagelen: 1,
			});
			if (reposResult.values.length === 0) {
				console.warn('No repositories found in workspace');
				return null;
			}
			const repoSlug = reposResult.values[0].name;

			return { workspaceSlug, repoSlug };
		} catch (error) {
			console.warn(
				'Could not fetch workspace/repository for issue tests:',
				error,
			);
			return null;
		}
	}

	describe('list', () => {
		it('should list issues for a repository', async () => {
			if (skipIfNoCredentials()) return;

			const repoInfo = await getWorkspaceAndRepo();
			if (!repoInfo) {
				console.warn('Skipping test: No workspace/repository found.');
				return;
			}

			try {
				const result = await atlassianIssuesController.list({
					workspaceSlug: repoInfo.workspaceSlug,
					repoSlug: repoInfo.repoSlug,
				});

				logger.debug('List issues controller result:', result);

				// Verify markdown formatting
				expect(result).toHaveProperty('content');
				expect(typeof result.content).toBe('string');
				expect(result.content.length).toBeGreaterThan(0);

				// Should either have issues or a "no issues" message
				expect(
					result.content.includes('# Issues') ||
						result.content.includes('No issues found'),
				).toBe(true);
			} catch (error) {
				// Issue tracker may be disabled
				if (error instanceof McpError && error.statusCode === 404) {
					console.warn('Issue tracker disabled on repository');
					return;
				}
				throw error;
			}
		}, 30000);

		it('should apply default limit if not provided', async () => {
			if (skipIfNoCredentials()) return;

			const repoInfo = await getWorkspaceAndRepo();
			if (!repoInfo) {
				console.warn('Skipping test: No workspace/repository found.');
				return;
			}

			// Spy on service to verify default is applied
			const serviceSpy = jest.spyOn(atlassianIssuesService, 'list');

			try {
				await atlassianIssuesController.list({
					workspaceSlug: repoInfo.workspaceSlug,
					repoSlug: repoInfo.repoSlug,
				});

				// Verify service was called with default pagelen
				expect(serviceSpy).toHaveBeenCalled();
				const callArgs = serviceSpy.mock.calls[0][0];
				expect(callArgs).toHaveProperty('pagelen');
				expect(callArgs.pagelen).toBe(10);
			} catch (error) {
				if (error instanceof McpError && error.statusCode === 404) {
					console.warn('Issue tracker disabled');
					return;
				}
				throw error;
			} finally {
				serviceSpy.mockRestore();
			}
		}, 30000);

		it('should support filtering by status', async () => {
			if (skipIfNoCredentials()) return;

			const repoInfo = await getWorkspaceAndRepo();
			if (!repoInfo) {
				console.warn('Skipping test: No workspace/repository found.');
				return;
			}

			try {
				const result = await atlassianIssuesController.list({
					workspaceSlug: repoInfo.workspaceSlug,
					repoSlug: repoInfo.repoSlug,
					status: 'open',
				});

				expect(result).toHaveProperty('content');
				expect(typeof result.content).toBe('string');
			} catch (error) {
				if (error instanceof McpError && error.statusCode === 404) {
					console.warn('Issue tracker disabled');
					return;
				}
				throw error;
			}
		}, 30000);
	});

	describe('get', () => {
		it('should get details of a specific issue', async () => {
			if (skipIfNoCredentials()) return;

			const repoInfo = await getWorkspaceAndRepo();
			if (!repoInfo) {
				console.warn('Skipping test: No workspace/repository found.');
				return;
			}

			try {
				// First list issues to get a valid issue ID
				const listResult = await atlassianIssuesService.list({
					workspace: repoInfo.workspaceSlug,
					repo_slug: repoInfo.repoSlug,
					pagelen: 1,
				});

				if (listResult.values.length === 0) {
					console.warn('No issues found to test get operation');
					return;
				}

				const issueId = listResult.values[0].id;

				// Now get the specific issue through controller
				const result = await atlassianIssuesController.get({
					workspaceSlug: repoInfo.workspaceSlug,
					repoSlug: repoInfo.repoSlug,
					issueId,
				});

				logger.debug('Get issue controller result:', result);

				// Verify markdown formatting
				expect(result).toHaveProperty('content');
				expect(typeof result.content).toBe('string');
				expect(result.content).toContain(`# Issue #${issueId}`);
				expect(result.content).toContain('## Details');
			} catch (error) {
				if (error instanceof McpError && error.statusCode === 404) {
					console.warn('Issue tracker disabled');
					return;
				}
				throw error;
			}
		}, 30000);

		it('should handle errors for non-existent issue', async () => {
			if (skipIfNoCredentials()) return;

			const repoInfo = await getWorkspaceAndRepo();
			if (!repoInfo) {
				console.warn('Skipping test: No workspace/repository found.');
				return;
			}

			try {
				await atlassianIssuesController.get({
					workspaceSlug: repoInfo.workspaceSlug,
					repoSlug: repoInfo.repoSlug,
					issueId: 999999999,
				});
				fail('Expected error for non-existent issue');
			} catch (error) {
				expect(error).toBeInstanceOf(McpError);
			}
		}, 30000);
	});

	describe('create', () => {
		it('should create a new issue', async () => {
			if (skipIfNoCredentials()) return;

			const repoInfo = await getWorkspaceAndRepo();
			if (!repoInfo) {
				console.warn('Skipping test: No workspace/repository found.');
				return;
			}

			const timestamp = Date.now();
			const title = `Test Issue ${timestamp}`;

			try {
				const result = await atlassianIssuesController.create({
					workspaceSlug: repoInfo.workspaceSlug,
					repoSlug: repoInfo.repoSlug,
					title,
					content: 'Test issue created by controller test',
					kind: 'task',
				});

				logger.debug('Create issue controller result:', result);

				// Verify success message
				expect(result).toHaveProperty('content');
				expect(result.content).toContain('✓ Issue created');
				expect(result.content).toContain(title);

				// Extract issue ID from response for cleanup
				const idMatch = result.content.match(/#(\d+)/);
				if (idMatch) {
					const issueId = parseInt(idMatch[1], 10);
					// Clean up
					try {
						await atlassianIssuesService.remove({
							workspace: repoInfo.workspaceSlug,
							repo_slug: repoInfo.repoSlug,
							issue_id: issueId,
						});
					} catch (cleanupError) {
						console.warn(
							'Failed to clean up test issue:',
							cleanupError,
						);
					}
				}
			} catch (error) {
				if (error instanceof McpError && error.statusCode === 404) {
					console.warn(
						'Issue tracker disabled or creation not allowed',
					);
					return;
				}
				throw error;
			}
		}, 30000);

		it('should throw error if title is missing', async () => {
			if (skipIfNoCredentials()) return;

			const repoInfo = await getWorkspaceAndRepo();
			if (!repoInfo) {
				console.warn('Skipping test: No workspace/repository found.');
				return;
			}

			try {
				await atlassianIssuesController.create({
					workspaceSlug: repoInfo.workspaceSlug,
					repoSlug: repoInfo.repoSlug,
					title: '',
					content: 'Content without title',
				});
				fail('Expected error for missing title');
			} catch (error) {
				expect(error).toBeInstanceOf(Error);
				expect((error as Error).message).toContain('title is required');
			}
		}, 30000);
	});

	describe('update', () => {
		it('should update an existing issue', async () => {
			if (skipIfNoCredentials()) return;

			const repoInfo = await getWorkspaceAndRepo();
			if (!repoInfo) {
				console.warn('Skipping test: No workspace/repository found.');
				return;
			}

			try {
				// First create a test issue
				const timestamp = Date.now();
				const createdIssue = await atlassianIssuesService.create({
					workspace: repoInfo.workspaceSlug,
					repo_slug: repoInfo.repoSlug,
					title: `Test Issue ${timestamp}`,
				});

				// Update the issue
				const newTitle = `Updated Issue ${timestamp}`;
				const result = await atlassianIssuesController.update({
					workspaceSlug: repoInfo.workspaceSlug,
					repoSlug: repoInfo.repoSlug,
					issueId: createdIssue.id,
					title: newTitle,
					priority: 'major',
				});

				logger.debug('Update issue controller result:', result);

				// Verify success message
				expect(result).toHaveProperty('content');
				expect(result.content).toContain('✓ Issue updated');
				expect(result.content).toContain(newTitle);

				// Clean up
				try {
					await atlassianIssuesService.remove({
						workspace: repoInfo.workspaceSlug,
						repo_slug: repoInfo.repoSlug,
						issue_id: createdIssue.id,
					});
				} catch (cleanupError) {
					console.warn(
						'Failed to clean up test issue:',
						cleanupError,
					);
				}
			} catch (error) {
				if (error instanceof McpError && error.statusCode === 404) {
					console.warn('Issue tracker disabled');
					return;
				}
				throw error;
			}
		}, 30000);
	});

	describe('remove', () => {
		it('should delete an issue', async () => {
			if (skipIfNoCredentials()) return;

			const repoInfo = await getWorkspaceAndRepo();
			if (!repoInfo) {
				console.warn('Skipping test: No workspace/repository found.');
				return;
			}

			try {
				// First create a test issue
				const timestamp = Date.now();
				const createdIssue = await atlassianIssuesService.create({
					workspace: repoInfo.workspaceSlug,
					repo_slug: repoInfo.repoSlug,
					title: `Test Issue to Delete ${timestamp}`,
				});

				// Delete the issue via controller
				const result = await atlassianIssuesController.remove({
					workspaceSlug: repoInfo.workspaceSlug,
					repoSlug: repoInfo.repoSlug,
					issueId: createdIssue.id,
				});

				logger.debug('Delete issue controller result:', result);

				// Verify success message
				expect(result).toHaveProperty('content');
				expect(result.content).toContain('✓ Issue');
				expect(result.content).toContain('deleted successfully');
				expect(result.content).toContain(`#${createdIssue.id}`);
			} catch (error) {
				if (error instanceof McpError && error.statusCode === 404) {
					console.warn('Issue tracker disabled');
					return;
				}
				throw error;
			}
		}, 30000);
	});

	describe('listComments', () => {
		it('should list comments on an issue', async () => {
			if (skipIfNoCredentials()) return;

			const repoInfo = await getWorkspaceAndRepo();
			if (!repoInfo) {
				console.warn('Skipping test: No workspace/repository found.');
				return;
			}

			try {
				// First list issues to get a valid issue ID
				const listResult = await atlassianIssuesService.list({
					workspace: repoInfo.workspaceSlug,
					repo_slug: repoInfo.repoSlug,
					pagelen: 1,
				});

				if (listResult.values.length === 0) {
					console.warn('No issues found to test comments');
					return;
				}

				const issueId = listResult.values[0].id;

				// List comments
				const result = await atlassianIssuesController.listComments({
					workspaceSlug: repoInfo.workspaceSlug,
					repoSlug: repoInfo.repoSlug,
					issueId,
				});

				logger.debug('List comments controller result:', result);

				// Verify markdown formatting
				expect(result).toHaveProperty('content');
				expect(typeof result.content).toBe('string');
				expect(
					result.content.includes('# Comments') ||
						result.content.includes('No comments found'),
				).toBe(true);
			} catch (error) {
				if (error instanceof McpError && error.statusCode === 404) {
					console.warn('Issue tracker disabled');
					return;
				}
				throw error;
			}
		}, 30000);

		it('should apply default limit if not provided', async () => {
			if (skipIfNoCredentials()) return;

			const repoInfo = await getWorkspaceAndRepo();
			if (!repoInfo) {
				console.warn('Skipping test: No workspace/repository found.');
				return;
			}

			try {
				// First list issues to get a valid issue ID
				const listResult = await atlassianIssuesService.list({
					workspace: repoInfo.workspaceSlug,
					repo_slug: repoInfo.repoSlug,
					pagelen: 1,
				});

				if (listResult.values.length === 0) {
					console.warn('No issues found');
					return;
				}

				const issueId = listResult.values[0].id;

				// Spy on service
				const serviceSpy = jest.spyOn(
					atlassianIssuesService,
					'listComments',
				);

				await atlassianIssuesController.listComments({
					workspaceSlug: repoInfo.workspaceSlug,
					repoSlug: repoInfo.repoSlug,
					issueId,
				});

				// Verify service was called with default pagelen
				expect(serviceSpy).toHaveBeenCalled();
				const callArgs = serviceSpy.mock.calls[0][0];
				expect(callArgs).toHaveProperty('pagelen');
				expect(callArgs.pagelen).toBe(20);

				serviceSpy.mockRestore();
			} catch (error) {
				if (error instanceof McpError && error.statusCode === 404) {
					console.warn('Issue tracker disabled');
					return;
				}
				throw error;
			}
		}, 30000);
	});

	describe('addComment', () => {
		it('should add a comment to an issue', async () => {
			if (skipIfNoCredentials()) return;

			const repoInfo = await getWorkspaceAndRepo();
			if (!repoInfo) {
				console.warn('Skipping test: No workspace/repository found.');
				return;
			}

			try {
				// Create a test issue
				const timestamp = Date.now();
				const createdIssue = await atlassianIssuesService.create({
					workspace: repoInfo.workspaceSlug,
					repo_slug: repoInfo.repoSlug,
					title: `Test Issue for Comments ${timestamp}`,
				});

				// Add a comment via controller
				const commentContent = 'Test comment from controller';
				const result = await atlassianIssuesController.addComment({
					workspaceSlug: repoInfo.workspaceSlug,
					repoSlug: repoInfo.repoSlug,
					issueId: createdIssue.id,
					content: commentContent,
				});

				logger.debug('Add comment controller result:', result);

				// Verify success message
				expect(result).toHaveProperty('content');
				expect(result.content).toContain('✓ Comment');
				expect(result.content).toContain('added successfully');

				// Clean up
				try {
					await atlassianIssuesService.remove({
						workspace: repoInfo.workspaceSlug,
						repo_slug: repoInfo.repoSlug,
						issue_id: createdIssue.id,
					});
				} catch (cleanupError) {
					console.warn(
						'Failed to clean up test issue:',
						cleanupError,
					);
				}
			} catch (error) {
				if (error instanceof McpError && error.statusCode === 404) {
					console.warn('Issue tracker disabled');
					return;
				}
				throw error;
			}
		}, 30000);

		it('should throw error if content is missing', async () => {
			if (skipIfNoCredentials()) return;

			const repoInfo = await getWorkspaceAndRepo();
			if (!repoInfo) {
				console.warn('Skipping test: No workspace/repository found.');
				return;
			}

			try {
				await atlassianIssuesController.addComment({
					workspaceSlug: repoInfo.workspaceSlug,
					repoSlug: repoInfo.repoSlug,
					issueId: 1,
					content: '',
				});
				fail('Expected error for missing content');
			} catch (error) {
				expect(error).toBeInstanceOf(Error);
				expect((error as Error).message).toContain(
					'content is required',
				);
			}
		}, 30000);
	});
});
