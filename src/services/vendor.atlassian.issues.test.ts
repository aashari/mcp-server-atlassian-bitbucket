import atlassianIssuesService from './vendor.atlassian.issues.service.js';
import { getAtlassianCredentials } from '../utils/transport.util.js';
import { config } from '../utils/config.util.js';
import { McpError } from '../utils/error.util.js';
import atlassianWorkspacesService from './vendor.atlassian.workspaces.service.js';
import atlassianRepositoriesService from './vendor.atlassian.repositories.service.js';
import { Issue } from './vendor.atlassian.issues.types.js';
import { Logger } from '../utils/logger.util.js';

// Instantiate logger for the test file
const logger = Logger.forContext(
	'services/vendor.atlassian.issues.service.test.ts',
);

describe('Vendor Atlassian Issues Service', () => {
	// Load configuration and check for credentials before all tests
	beforeAll(() => {
		config.load(); // Ensure config is loaded
		const credentials = getAtlassianCredentials();
		if (!credentials) {
			console.warn(
				'Skipping Atlassian Issues Service tests: No credentials available',
			);
		}
	});

	// Helper function to skip tests when credentials are missing
	const skipIfNoCredentials = () => !getAtlassianCredentials();

	// Helper to get a valid workspace and repository for testing
	async function getWorkspaceAndRepo(): Promise<{
		workspace: string;
		repo_slug: string;
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
			const workspace = workspacesResult.values[0].workspace.slug;

			// Get first repository in workspace
			const reposResult = await atlassianRepositoriesService.list({
				workspace,
				pagelen: 1,
			});
			if (reposResult.values.length === 0) {
				console.warn('No repositories found in workspace');
				return null;
			}
			const repo_slug = reposResult.values[0].name;

			return { workspace, repo_slug };
		} catch (error) {
			console.warn(
				'Could not fetch workspace/repository for issue tests:',
				error,
			);
			return null;
		}
	}

	// Verify issue structure
	function verifyIssueStructure(issue: Issue) {
		expect(issue).toHaveProperty('id');
		expect(typeof issue.id).toBe('number');
		expect(issue).toHaveProperty('title');
		expect(typeof issue.title).toBe('string');

		// Optional fields
		if (issue.content) {
			expect(issue.content).toHaveProperty('raw');
		}
		if (issue.reporter) {
			expect(issue.reporter).toHaveProperty('display_name');
		}
	}

	describe('list', () => {
		it('should return a list of issues for a valid repository', async () => {
			if (skipIfNoCredentials()) return;

			const repoInfo = await getWorkspaceAndRepo();
			if (!repoInfo) {
				console.warn('Skipping test: No workspace/repository found.');
				return;
			}

			try {
				const result = await atlassianIssuesService.list({
					workspace: repoInfo.workspace,
					repo_slug: repoInfo.repo_slug,
					pagelen: 10,
				});
				logger.debug('List issues result:', result);

				// Verify the response structure
				expect(result).toHaveProperty('values');
				expect(Array.isArray(result.values)).toBe(true);

				if (result.values.length > 0) {
					// Verify the structure of the first issue in the list
					verifyIssueStructure(result.values[0]);
				} else {
					console.warn(
						'No issues found in repository (issue tracker may be disabled)',
					);
				}
			} catch (error) {
				// Issue tracker may be disabled on the repository
				if (error instanceof McpError && error.statusCode === 404) {
					console.warn(
						'Issue tracker appears to be disabled on this repository',
					);
					return;
				}
				throw error;
			}
		}, 30000);

		it('should support pagination with pagelen', async () => {
			if (skipIfNoCredentials()) return;

			const repoInfo = await getWorkspaceAndRepo();
			if (!repoInfo) {
				console.warn('Skipping test: No workspace/repository found.');
				return;
			}

			try {
				const result = await atlassianIssuesService.list({
					workspace: repoInfo.workspace,
					repo_slug: repoInfo.repo_slug,
					pagelen: 1,
				});

				expect(result).toHaveProperty('pagelen');
				expect(result.values.length).toBeLessThanOrEqual(1);
			} catch (error) {
				if (error instanceof McpError && error.statusCode === 404) {
					console.warn('Issue tracker disabled on repository');
					return;
				}
				throw error;
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
				const result = await atlassianIssuesService.list({
					workspace: repoInfo.workspace,
					repo_slug: repoInfo.repo_slug,
					status: 'open',
					pagelen: 5,
				});

				expect(result).toHaveProperty('values');
				// All returned issues should be open if any are returned
				if (result.values.length > 0) {
					const allOpen = result.values.every(
						(issue) =>
							issue.state === 'open' || issue.state === 'new',
					);
					expect(allOpen).toBe(true);
				}
			} catch (error) {
				if (error instanceof McpError && error.statusCode === 404) {
					console.warn('Issue tracker disabled on repository');
					return;
				}
				throw error;
			}
		}, 30000);

		it('should support BBQL query filtering', async () => {
			if (skipIfNoCredentials()) return;

			const repoInfo = await getWorkspaceAndRepo();
			if (!repoInfo) {
				console.warn('Skipping test: No workspace/repository found.');
				return;
			}

			try {
				// Test BBQL query with state filter
				const result = await atlassianIssuesService.list({
					workspace: repoInfo.workspace,
					repo_slug: repoInfo.repo_slug,
					q: 'state="open"',
					pagelen: 5,
				});

				logger.debug('BBQL query result:', result);
				expect(result).toHaveProperty('values');
				expect(Array.isArray(result.values)).toBe(true);

				// Verify all returned issues match the query
				if (result.values.length > 0) {
					const allMatchQuery = result.values.every(
						(issue) => issue.state === 'open',
					);
					expect(allMatchQuery).toBe(true);
				}
			} catch (error) {
				if (error instanceof McpError && error.statusCode === 404) {
					console.warn('Issue tracker disabled on repository');
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
					workspace: repoInfo.workspace,
					repo_slug: repoInfo.repo_slug,
					pagelen: 1,
				});

				if (listResult.values.length === 0) {
					console.warn('No issues found to test get operation');
					return;
				}

				const issueId = listResult.values[0].id;

				// Now get the specific issue
				const issue = await atlassianIssuesService.get({
					workspace: repoInfo.workspace,
					repo_slug: repoInfo.repo_slug,
					issue_id: issueId,
				});

				logger.debug('Get issue result:', issue);
				verifyIssueStructure(issue);
				expect(issue.id).toBe(issueId);
			} catch (error) {
				if (error instanceof McpError && error.statusCode === 404) {
					console.warn('Issue tracker disabled on repository');
					return;
				}
				throw error;
			}
		}, 30000);

		it('should throw error for non-existent issue', async () => {
			if (skipIfNoCredentials()) return;

			const repoInfo = await getWorkspaceAndRepo();
			if (!repoInfo) {
				console.warn('Skipping test: No workspace/repository found.');
				return;
			}

			try {
				await atlassianIssuesService.get({
					workspace: repoInfo.workspace,
					repo_slug: repoInfo.repo_slug,
					issue_id: 999999999,
				});
				// Should not reach here
				fail('Expected error for non-existent issue');
			} catch (error) {
				expect(error).toBeInstanceOf(McpError);
				// Could be 404 (issue not found) or 404 (tracker disabled)
				expect((error as McpError).statusCode).toBe(404);
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
			const content = `This is a test issue created at ${new Date().toISOString()}`;

			try {
				const issue = await atlassianIssuesService.create({
					workspace: repoInfo.workspace,
					repo_slug: repoInfo.repo_slug,
					title,
					content,
					kind: 'task',
					priority: 'minor',
				});

				logger.debug('Create issue result:', issue);
				verifyIssueStructure(issue);
				expect(issue.title).toBe(title);
				expect(issue.kind).toBe('task');
				expect(issue.priority).toBe('minor');

				// Clean up - delete the test issue
				try {
					await atlassianIssuesService.remove({
						workspace: repoInfo.workspace,
						repo_slug: repoInfo.repo_slug,
						issue_id: issue.id,
					});
				} catch (cleanupError) {
					console.warn(
						'Failed to clean up test issue:',
						cleanupError,
					);
				}
			} catch (error) {
				if (error instanceof McpError && error.statusCode === 404) {
					console.warn(
						'Issue tracker disabled or issue creation not allowed',
					);
					return;
				}
				throw error;
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
					workspace: repoInfo.workspace,
					repo_slug: repoInfo.repo_slug,
					title: `Test Issue ${timestamp}`,
					content: 'Original content',
					kind: 'task',
				});

				// Update the issue
				const newTitle = `Updated Issue ${timestamp}`;
				const updatedIssue = await atlassianIssuesService.update({
					workspace: repoInfo.workspace,
					repo_slug: repoInfo.repo_slug,
					issue_id: createdIssue.id,
					title: newTitle,
					priority: 'major',
				});

				logger.debug('Update issue result:', updatedIssue);
				expect(updatedIssue.id).toBe(createdIssue.id);
				expect(updatedIssue.title).toBe(newTitle);
				expect(updatedIssue.priority).toBe('major');

				// Clean up
				try {
					await atlassianIssuesService.remove({
						workspace: repoInfo.workspace,
						repo_slug: repoInfo.repo_slug,
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
					workspace: repoInfo.workspace,
					repo_slug: repoInfo.repo_slug,
					title: `Test Issue to Delete ${timestamp}`,
					content: 'This issue will be deleted',
				});

				// Delete the issue
				await atlassianIssuesService.remove({
					workspace: repoInfo.workspace,
					repo_slug: repoInfo.repo_slug,
					issue_id: createdIssue.id,
				});

				// Verify the issue is deleted by trying to get it
				try {
					await atlassianIssuesService.get({
						workspace: repoInfo.workspace,
						repo_slug: repoInfo.repo_slug,
						issue_id: createdIssue.id,
					});
					fail('Expected error when getting deleted issue');
				} catch (error) {
					expect(error).toBeInstanceOf(McpError);
					expect((error as McpError).statusCode).toBe(404);
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
					workspace: repoInfo.workspace,
					repo_slug: repoInfo.repo_slug,
					pagelen: 1,
				});

				if (listResult.values.length === 0) {
					console.warn('No issues found to test comments');
					return;
				}

				const issueId = listResult.values[0].id;

				// List comments
				const comments = await atlassianIssuesService.listComments({
					workspace: repoInfo.workspace,
					repo_slug: repoInfo.repo_slug,
					issue_id: issueId,
					pagelen: 10,
				});

				logger.debug('List comments result:', comments);
				expect(comments).toHaveProperty('values');
				expect(Array.isArray(comments.values)).toBe(true);

				// Verify structure if comments exist
				if (comments.values.length > 0) {
					const firstComment = comments.values[0];
					expect(firstComment).toHaveProperty('id');
					expect(firstComment).toHaveProperty('content');
					expect(firstComment.content).toHaveProperty('raw');
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
					workspace: repoInfo.workspace,
					repo_slug: repoInfo.repo_slug,
					title: `Test Issue for Comments ${timestamp}`,
				});

				// Add a comment
				const commentContent = `Test comment added at ${new Date().toISOString()}`;
				const comment = await atlassianIssuesService.addComment({
					workspace: repoInfo.workspace,
					repo_slug: repoInfo.repo_slug,
					issue_id: createdIssue.id,
					content: commentContent,
				});

				logger.debug('Add comment result:', comment);
				expect(comment).toHaveProperty('id');
				expect(comment).toHaveProperty('content');
				expect(comment.content.raw).toBe(commentContent);

				// Clean up
				try {
					await atlassianIssuesService.remove({
						workspace: repoInfo.workspace,
						repo_slug: repoInfo.repo_slug,
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
});
