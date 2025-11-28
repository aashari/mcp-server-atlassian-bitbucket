import { McpError, ErrorType } from '../utils/error.util.js';
import atlassianPullRequestsController from './atlassian.pullrequests.controller.js';
import { getAtlassianCredentials } from '../utils/transport.util.js';
import atlassianPullRequestsService from '../services/vendor.atlassian.pullrequests.service.js';
import atlassianWorkspacesService from '../services/vendor.atlassian.workspaces.service.js';
import atlassianRepositoriesService from '../services/vendor.atlassian.repositories.service.js';

describe('Atlassian Pull Requests Controller', () => {
	const skipIfNoCredentials = () => !getAtlassianCredentials();

	async function getRepositoryInfo(): Promise<{
		workspaceSlug: string;
		repoSlug: string;
	} | null> {
		// Skip if no credentials
		if (skipIfNoCredentials()) return null;

		try {
			// Try to get workspaces
			const workspacesResponse = await atlassianWorkspacesService.list({
				pagelen: 1,
			});

			if (
				!workspacesResponse.values ||
				workspacesResponse.values.length === 0
			) {
				console.warn('No workspaces found for test account');
				return null;
			}

			const workspace = workspacesResponse.values[0];
			// The workspace slug might be in different locations depending on the response structure
			// Try to access it safely from possible locations
			const workspaceSlug =
				workspace.workspace?.slug ||
				(workspace as any).slug ||
				(workspace as any).name ||
				null;

			if (!workspaceSlug) {
				console.warn(
					'Could not determine workspace slug from response',
				);
				return null;
			}

			// Get repositories for this workspace
			const reposResponse = await atlassianRepositoriesService.list({
				workspace: workspaceSlug,
				pagelen: 1,
			});

			if (!reposResponse.values || reposResponse.values.length === 0) {
				console.warn(
					`No repositories found in workspace ${workspaceSlug}`,
				);
				return null;
			}

			const repo = reposResponse.values[0];
			// The repo slug might be in different locations or named differently
			const repoSlug =
				(repo as any).slug ||
				(repo as any).name ||
				(repo.full_name?.split('/').pop() as string) ||
				null;

			if (!repoSlug) {
				console.warn(
					'Could not determine repository slug from response',
				);
				return null;
			}

			return {
				workspaceSlug,
				repoSlug,
			};
		} catch (error) {
			console.warn('Failed to get repository info for tests:', error);
			return null;
		}
	}

	async function getFirstPullRequestId(): Promise<{
		workspaceSlug: string;
		repoSlug: string;
		prId: string;
	} | null> {
		const repoInfo = await getRepositoryInfo();
		if (!repoInfo) return null;

		try {
			// List PRs
			const prsResponse = await atlassianPullRequestsService.list({
				workspace: repoInfo.workspaceSlug,
				repo_slug: repoInfo.repoSlug,
				pagelen: 1,
			});

			if (!prsResponse.values || prsResponse.values.length === 0) {
				console.warn(
					`No pull requests found in ${repoInfo.workspaceSlug}/${repoInfo.repoSlug}`,
				);
				return null;
			}

			// Return the first PR's info
			return {
				workspaceSlug: repoInfo.workspaceSlug,
				repoSlug: repoInfo.repoSlug,
				prId: prsResponse.values[0].id.toString(),
			};
		} catch (error) {
			console.warn('Failed to get pull request ID for tests:', error);
			return null;
		}
	}

	// List tests
	describe('list', () => {
		it('should list pull requests for a repository', async () => {
			if (skipIfNoCredentials()) return;

			const repoInfo = await getRepositoryInfo();
			if (!repoInfo) {
				console.warn('Skipping test: No repository info found.');
				return;
			}

			const result = await atlassianPullRequestsController.list({
				workspaceSlug: repoInfo.workspaceSlug,
				repoSlug: repoInfo.repoSlug,
			});

			// Verify the response structure
			expect(result).toHaveProperty('content');
			expect(typeof result.content).toBe('string');

			// Check for expected format based on the formatter output
			expect(result.content).toMatch(/^# Pull Requests/);
		}, 30000);

		it('should handle query parameters correctly', async () => {
			if (skipIfNoCredentials()) return;

			const repoInfo = await getRepositoryInfo();
			if (!repoInfo) {
				console.warn('Skipping test: No repository info found.');
				return;
			}

			// A query term that should not match any PRs in any normal repo
			const uniqueQuery = 'z9x8c7vb6nm5';

			const result = await atlassianPullRequestsController.list({
				workspaceSlug: repoInfo.workspaceSlug,
				repoSlug: repoInfo.repoSlug,
				query: uniqueQuery,
			});

			// Even with no matches, we expect a formatted empty list
			expect(result).toHaveProperty('content');
			expect(result.content).toMatch(/^# Pull Requests/);
			expect(result.content).toContain('No pull requests found');
		}, 30000);

		it('should handle pagination options (limit)', async () => {
			if (skipIfNoCredentials()) return;

			const repoInfo = await getRepositoryInfo();
			if (!repoInfo) {
				console.warn('Skipping test: No repository info found.');
				return;
			}

			// Fetch with a small limit
			const result = await atlassianPullRequestsController.list({
				workspaceSlug: repoInfo.workspaceSlug,
				repoSlug: repoInfo.repoSlug,
				limit: 1,
			});

			// Verify the response structure
			expect(result).toHaveProperty('content');

			// Check if the result contains only one PR or none
			// First check if there are no PRs
			if (result.content.includes('No pull requests found')) {
				console.warn('No pull requests found for pagination test.');
				return;
			}

			// Extract count
			const countMatch = result.content.match(/\*Showing (\d+) item/);
			if (countMatch && countMatch[1]) {
				const count = parseInt(countMatch[1], 10);
				expect(count).toBeLessThanOrEqual(1);
			}
		}, 30000);

		it('should handle authorization errors gracefully', async () => {
			if (skipIfNoCredentials()) return;

			const repoInfo = await getRepositoryInfo();
			if (!repoInfo) {
				console.warn('Skipping test: No repository info found.');
				return;
			}

			// Create mocked credentials error by using intentionally invalid credentials
			jest.spyOn(
				atlassianPullRequestsService,
				'list',
			).mockRejectedValueOnce(
				new McpError('Unauthorized', ErrorType.AUTH_INVALID, 401),
			);

			// Expect to throw a standardized error
			await expect(
				atlassianPullRequestsController.list({
					workspaceSlug: repoInfo.workspaceSlug,
					repoSlug: repoInfo.repoSlug,
				}),
			).rejects.toThrow(McpError);

			// Verify it was called
			expect(atlassianPullRequestsService.list).toHaveBeenCalled();

			// Cleanup mock
			jest.restoreAllMocks();
		}, 30000);

		it('should require workspace and repository slugs', async () => {
			if (skipIfNoCredentials()) return;

			// Missing both slugs
			await expect(
				atlassianPullRequestsController.list({} as any),
			).rejects.toThrow(
				/workspace slug and repository slug are required/i,
			);

			// Missing repo slug
			await expect(
				atlassianPullRequestsController.list({
					workspaceSlug: 'some-workspace',
				} as any),
			).rejects.toThrow(
				/workspace slug and repository slug are required/i,
			);

			// Missing workspace slug but should try to use default
			// This will fail with a different error if no default workspace can be found
			try {
				await atlassianPullRequestsController.list({
					repoSlug: 'some-repo',
				} as any);
			} catch (error) {
				expect(error).toBeInstanceOf(Error);
				// Either it will fail with "could not determine default" or
				// it may succeed with a default workspace but fail with a different error
			}
		}, 10000);

		it('should apply default parameters correctly', async () => {
			if (skipIfNoCredentials()) return;

			const repoInfo = await getRepositoryInfo();
			if (!repoInfo) {
				console.warn('Skipping test: No repository info found.');
				return;
			}

			const serviceSpy = jest.spyOn(atlassianPullRequestsService, 'list');

			try {
				await atlassianPullRequestsController.list({
					workspaceSlug: repoInfo.workspaceSlug,
					repoSlug: repoInfo.repoSlug,
					// No limit provided, should use default
				});

				// Check that the service was called with the default limit
				const calls = serviceSpy.mock.calls;
				expect(calls.length).toBeGreaterThan(0);
				const lastCall = calls[calls.length - 1];
				expect(lastCall[0]).toHaveProperty('pagelen');
				expect(lastCall[0].pagelen).toBeGreaterThan(0); // Should have some positive default value
			} finally {
				serviceSpy.mockRestore();
			}
		}, 30000);

		it('should format pagination information correctly', async () => {
			if (skipIfNoCredentials()) return;

			const repoInfo = await getRepositoryInfo();
			if (!repoInfo) {
				console.warn('Skipping test: No repository info found.');
				return;
			}

			// Mock a response with pagination
			const mockResponse = {
				values: [
					{
						id: 1,
						title: 'Test PR',
						state: 'OPEN',
						created_on: new Date().toISOString(),
						updated_on: new Date().toISOString(),
						author: {
							display_name: 'Test User',
						},
						source: {
							branch: { name: 'feature-branch' },
						},
						destination: {
							branch: { name: 'main' },
						},
						links: {},
					},
				],
				page: 1,
				size: 1,
				pagelen: 1,
				next: 'https://api.bitbucket.org/2.0/repositories/workspace/repo/pullrequests?page=2',
			};

			jest.spyOn(
				atlassianPullRequestsService,
				'list',
			).mockResolvedValueOnce(mockResponse as any);

			const result = await atlassianPullRequestsController.list({
				workspaceSlug: repoInfo.workspaceSlug,
				repoSlug: repoInfo.repoSlug,
				limit: 1,
			});

			// Verify pagination info is included
			expect(result.content).toContain('*Showing 1 item');
			expect(result.content).toContain('More results are available');
			expect(result.content).toContain('Next cursor: `2`');

			// Cleanup mock
			jest.restoreAllMocks();
		}, 10000);
	});

	// List comments tests
	describe('listComments', () => {
		it('should return formatted pull request comments in Markdown', async () => {
			if (skipIfNoCredentials()) return;

			const prInfo = await getFirstPullRequestId();
			if (!prInfo) {
				console.warn('Skipping test: No pull request ID found.');
				return;
			}

			const result = await atlassianPullRequestsController.listComments({
				workspaceSlug: prInfo.workspaceSlug,
				repoSlug: prInfo.repoSlug,
				prId: prInfo.prId,
			});

			// Verify the response structure
			expect(result).toHaveProperty('content');
			expect(typeof result.content).toBe('string');

			// Basic Markdown content checks
			if (result.content !== 'No comments found on this pull request.') {
				expect(result.content).toMatch(/^# Comments on Pull Request/m);
				expect(result.content).toContain('**Author**:');
				expect(result.content).toContain('**Updated**:');
				expect(result.content).toMatch(
					/---\s*\*Showing \d+ items?\.\*/,
				);
			}
		}, 30000);

		it('should handle pagination options (limit/cursor)', async () => {
			if (skipIfNoCredentials()) return;

			const prInfo = await getFirstPullRequestId();
			if (!prInfo) {
				console.warn('Skipping test: No pull request ID found.');
				return;
			}

			// Fetch first page with limit 1
			const result1 = await atlassianPullRequestsController.listComments({
				workspaceSlug: prInfo.workspaceSlug,
				repoSlug: prInfo.repoSlug,
				prId: prInfo.prId,
				limit: 1,
			});

			// Extract pagination info from content
			const countMatch1 = result1.content.match(
				/\*Showing (\d+) items?\.\*/,
			);
			const count1 = countMatch1 ? parseInt(countMatch1[1], 10) : 0;
			expect(count1).toBeLessThanOrEqual(1);

			// Extract cursor from content
			const cursorMatch1 = result1.content.match(
				/\*Next cursor: `([^`]+)`\*/,
			);
			const nextCursor = cursorMatch1 ? cursorMatch1[1] : null;

			// Check if pagination indicates more results
			const hasMoreResults = result1.content.includes(
				'More results are available.',
			);

			// If there's a next page, fetch it
			if (hasMoreResults && nextCursor) {
				const result2 =
					await atlassianPullRequestsController.listComments({
						workspaceSlug: prInfo.workspaceSlug,
						repoSlug: prInfo.repoSlug,
						prId: prInfo.prId,
						limit: 1,
						cursor: nextCursor,
					});

				// Extract count from result2
				const countMatch2 = result2.content.match(
					/\*Showing (\d+) items?\.\*/,
				);
				const count2 = countMatch2 ? parseInt(countMatch2[1], 10) : 0;
				expect(count2).toBeLessThanOrEqual(1);

				// Ensure content is different (or handle case where only 1 comment exists)
				if (
					result1.content !==
						'No comments found on this pull request.' &&
					result2.content !==
						'No comments found on this pull request.' &&
					count1 > 0 &&
					count2 > 0
				) {
					// Only compare if we actually have multiple comments
					expect(result1.content).not.toEqual(result2.content);
				}
			} else {
				console.warn(
					'Skipping cursor part of pagination test: Only one page of comments found or no comments available.',
				);
			}
		}, 30000);

		it('should handle empty result scenario', async () => {
			if (skipIfNoCredentials()) return;

			// First get a PR without comments, or use a non-existent but valid format PR ID
			const repoInfo = await getRepositoryInfo();
			if (!repoInfo) {
				console.warn('Skipping test: No repository info found.');
				return;
			}

			// Try to find a PR without comments
			try {
				// First check if we can access the repository
				const repoResult = await atlassianPullRequestsController.list({
					workspaceSlug: repoInfo.workspaceSlug,
					repoSlug: repoInfo.repoSlug,
					limit: 1,
				});

				// Extract PR ID from the content if we have any PRs
				const prIdMatch =
					repoResult.content.match(/\*\*ID\*\*:\s+(\d+)/);
				if (!prIdMatch || !prIdMatch[1]) {
					console.warn(
						'Skipping empty result test: No pull requests available.',
					);
					return;
				}

				const prId = prIdMatch[1];

				// Get comments for this PR
				const commentsResult =
					await atlassianPullRequestsController.listComments({
						workspaceSlug: repoInfo.workspaceSlug,
						repoSlug: repoInfo.repoSlug,
						prId,
					});

				// Check if there are no comments
				if (
					commentsResult.content ===
					'No comments found on this pull request.'
				) {
					// Verify the expected message for empty results
					expect(commentsResult.content).toBe(
						'No comments found on this pull request.',
					);
				} else {
					console.warn(
						'Skipping empty result test: All PRs have comments.',
					);
				}
			} catch (error) {
				console.warn('Error during empty result test:', error);
			}
		}, 30000);

		it('should throw an McpError for a non-existent pull request ID', async () => {
			if (skipIfNoCredentials()) return;

			const repoInfo = await getRepositoryInfo();
			if (!repoInfo) {
				console.warn('Skipping test: No repository info found.');
				return;
			}

			const nonExistentId = '999999999'; // Very high number unlikely to exist

			// Expect the controller call to reject with an McpError
			await expect(
				atlassianPullRequestsController.listComments({
					workspaceSlug: repoInfo.workspaceSlug,
					repoSlug: repoInfo.repoSlug,
					prId: nonExistentId,
				}),
			).rejects.toThrow(McpError);

			// Check the status code via the error handler's behavior
			try {
				await atlassianPullRequestsController.listComments({
					workspaceSlug: repoInfo.workspaceSlug,
					repoSlug: repoInfo.repoSlug,
					prId: nonExistentId,
				});
			} catch (e) {
				expect(e).toBeInstanceOf(McpError);
				expect((e as McpError).statusCode).toBe(404); // Expecting Not Found
				expect((e as McpError).message).toContain('not found');
			}
		}, 30000);

		it('should require all necessary parameters', async () => {
			if (skipIfNoCredentials()) return;

			// No parameters
			await expect(
				atlassianPullRequestsController.listComments({} as any),
			).rejects.toThrow();

			// Missing PR ID
			const repoInfo = await getRepositoryInfo();
			if (repoInfo) {
				await expect(
					atlassianPullRequestsController.listComments({
						workspaceSlug: repoInfo.workspaceSlug,
						repoSlug: repoInfo.repoSlug,
						// prId: missing
					} as any),
				).rejects.toThrow();
			}
		}, 10000);
	});

	// Note: addComment test suite has been removed to avoid creating comments on real PRs during tests
});
