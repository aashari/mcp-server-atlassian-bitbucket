import { handleRepositoriesList } from './atlassian.repositories.list.controller.js';
import { getAtlassianCredentials } from '../utils/transport.util.js';
import { config } from '../utils/config.util.js';
import { McpError } from '../utils/error.util.js';
import atlassianWorkspacesController from './atlassian.workspaces.controller.js';

describe('Atlassian Repositories Controller', () => {
	// Load configuration and check for credentials before all tests
	beforeAll(() => {
		config.load(); // Ensure config is loaded
		const credentials = getAtlassianCredentials();
		if (!credentials) {
			console.warn(
				'Skipping Atlassian Repositories Controller tests: No credentials available',
			);
		}
	});

	// Helper function to skip tests when credentials are missing
	const skipIfNoCredentials = () => !getAtlassianCredentials();

	describe('list', () => {
		// Helper to get a valid workspace slug for testing
		async function getFirstWorkspaceSlugForController(): Promise<
			string | null
		> {
			if (skipIfNoCredentials()) return null;

			try {
				const listResult = await atlassianWorkspacesController.list({
					limit: 1,
				});

				if (listResult.content === 'No Bitbucket workspaces found.')
					return null;

				// Extract slug from Markdown content
				const slugMatch = listResult.content.match(
					/\*\*Slug\*\*:\s+([^\s\n]+)/,
				);
				return slugMatch ? slugMatch[1] : null;
			} catch (error) {
				console.warn(
					"Could not fetch workspace list for controller 'list' test setup:",
					error,
				);
				return null;
			}
		}

		it('should return a formatted list of repositories in Markdown', async () => {
			if (skipIfNoCredentials()) return;

			const workspaceSlug = await getFirstWorkspaceSlugForController();
			if (!workspaceSlug) {
				console.warn('Skipping test: No workspace slug found.');
				return;
			}

			const result = await handleRepositoriesList({
				workspaceSlug,
			});

			// Verify the response structure
			expect(result).toHaveProperty('content');
			expect(typeof result.content).toBe('string');

			// Basic Markdown content checks
			if (result.content !== 'No repositories found in this workspace.') {
				expect(result.content).toMatch(/^# Bitbucket Repositories/m);
				expect(result.content).toContain('**Name**');
				expect(result.content).toContain('**Full Name**');
				expect(result.content).toContain('**Updated**');
			}

			// Check for pagination information in the content string
			expect(result.content).toMatch(
				/---[\s\S]*\*Showing \d+ (of \d+ total items|\S+ items?)[\s\S]*\*/,
			);
		}, 30000);

		it('should handle pagination options (limit/cursor)', async () => {
			if (skipIfNoCredentials()) return;

			const workspaceSlug = await getFirstWorkspaceSlugForController();
			if (!workspaceSlug) {
				console.warn('Skipping test: No workspace slug found.');
				return;
			}

			// Fetch first page with limit 1
			const result1 = await handleRepositoriesList({
				workspaceSlug,
				limit: 1,
			});

			// Extract pagination info from content instead of accessing pagination object
			const countMatch = result1.content.match(
				/\*Showing (\d+) items?\.\*/,
			);
			const count = countMatch ? parseInt(countMatch[1], 10) : 0;
			expect(count).toBeLessThanOrEqual(1);

			// Extract cursor from content
			const cursorMatch = result1.content.match(
				/\*Next cursor: `([^`]+)`\*/,
			);
			const nextCursor = cursorMatch ? cursorMatch[1] : null;

			// Check if pagination indicates more results
			const hasMoreResults = result1.content.includes(
				'More results are available.',
			);

			// If there's a next page, fetch it
			if (hasMoreResults && nextCursor) {
				const result2 = await handleRepositoriesList({
					workspaceSlug,
					limit: 1,
					cursor: nextCursor,
				});
				expect(result2.content).toMatch(
					/---[\s\S]*\*Showing \d+ (of \d+ total items|\S+ items?)[\s\S]*\*/,
				);

				// Ensure content is different (or handle case where only 1 repo exists)
				if (
					result1.content !==
						'No repositories found in this workspace.' &&
					result2.content !==
						'No repositories found in this workspace.' &&
					count > 0 &&
					count > 0
				) {
					// Only compare if we actually have multiple repositories
					expect(result1.content).not.toEqual(result2.content);
				}
			} else {
				console.warn(
					'Skipping cursor part of pagination test: Only one page of repositories found.',
				);
			}
		}, 30000);

		it('should handle filtering options (query)', async () => {
			if (skipIfNoCredentials()) return;

			const workspaceSlug = await getFirstWorkspaceSlugForController();
			if (!workspaceSlug) {
				console.warn('Skipping test: No workspace slug found.');
				return;
			}

			// First get all repositories to find a valid query term
			const allResult = await handleRepositoriesList({
				workspaceSlug,
			});

			if (
				allResult.content === 'No repositories found in this workspace.'
			) {
				console.warn('Skipping filtering test: No repositories found.');
				return;
			}

			// Extract a repository name from the first result to use as a query
			const repoNameMatch = allResult.content.match(
				/\*\*Name\*\*:\s+([^\n]+)/,
			);
			if (!repoNameMatch || !repoNameMatch[1]) {
				console.warn(
					'Skipping filtering test: Could not extract repository name.',
				);
				return;
			}

			// Use part of the repo name as a query term
			const queryTerm = repoNameMatch[1].trim().split(' ')[0];

			// Query with the extracted term
			const filteredResult = await handleRepositoriesList({
				workspaceSlug,
				query: queryTerm,
			});

			// The result should be a valid response
			expect(filteredResult).toHaveProperty('content');
			expect(typeof filteredResult.content).toBe('string');

			// We can't guarantee matches (query might not match anything), but response should be valid
			if (
				filteredResult.content !==
				'No repositories found in this workspace.'
			) {
				expect(filteredResult.content).toMatch(
					/^# Bitbucket Repositories/m,
				);
			}
		}, 30000);

		it('should handle sorting options', async () => {
			if (skipIfNoCredentials()) return;

			const workspaceSlug = await getFirstWorkspaceSlugForController();
			if (!workspaceSlug) {
				console.warn('Skipping test: No workspace slug found.');
				return;
			}

			// Request with explicit sort by name
			const sortedResult = await handleRepositoriesList({
				workspaceSlug,
				sort: 'name',
			});

			// The result should be a valid response
			expect(sortedResult).toHaveProperty('content');
			expect(typeof sortedResult.content).toBe('string');

			// We can't verify the exact sort order in the Markdown output easily,
			// but we can verify the response is valid
			if (
				sortedResult.content !==
				'No repositories found in this workspace.'
			) {
				expect(sortedResult.content).toMatch(
					/^# Bitbucket Repositories/m,
				);
			}
		}, 30000);

		it('should handle role filtering if supported', async () => {
			if (skipIfNoCredentials()) return;

			const workspaceSlug = await getFirstWorkspaceSlugForController();
			if (!workspaceSlug) {
				console.warn('Skipping test: No workspace slug found.');
				return;
			}

			// Try filtering by role
			try {
				const filteredResult = await handleRepositoriesList({
					workspaceSlug,
					role: 'owner', // Most likely role to have some results
				});

				// The result should be a valid response
				expect(filteredResult).toHaveProperty('content');
				expect(typeof filteredResult.content).toBe('string');

				// We can't guarantee matches, but response should be valid
				if (
					filteredResult.content !==
					'No repositories found in this workspace.'
				) {
					expect(filteredResult.content).toMatch(
						/^# Bitbucket Repositories/m,
					);
				}
			} catch (error) {
				// If role filtering isn't supported, log and continue
				console.warn(
					'Role filtering test encountered an error:',
					error,
				);
			}
		}, 30000);

		it('should handle empty result scenario', async () => {
			if (skipIfNoCredentials()) return;

			const workspaceSlug = await getFirstWorkspaceSlugForController();
			if (!workspaceSlug) {
				console.warn('Skipping test: No workspace slug found.');
				return;
			}

			// Use an extremely unlikely query to get empty results
			const noMatchQuery = 'thisstringwillnotmatchanyrepository12345xyz';

			const emptyResult = await handleRepositoriesList({
				workspaceSlug,
				query: noMatchQuery,
			});

			// Should return a specific "no results" message
			expect(emptyResult.content).toContain(
				'No repositories found matching your criteria.',
			);
		}, 30000);

		it('should throw an McpError for an invalid workspace slug', async () => {
			if (skipIfNoCredentials()) return;

			const invalidWorkspaceSlug =
				'this-workspace-definitely-does-not-exist-12345';

			// Expect the controller call to reject with an McpError
			await expect(
				handleRepositoriesList({
					workspaceSlug: invalidWorkspaceSlug,
				}),
			).rejects.toThrow(McpError);

			// Check the status code via the error handler's behavior
			try {
				await handleRepositoriesList({
					workspaceSlug: invalidWorkspaceSlug,
				});
			} catch (e) {
				expect(e).toBeInstanceOf(McpError);
				expect((e as McpError).statusCode).toBe(404); // Expecting Not Found
				expect((e as McpError).message).toContain('not found');
			}
		}, 30000);
	});

	// Note: 'get' functionality (repository details, commit history, file content) has been replaced by the generic bb_get tool
	// Use: bb_get({ path: "/repositories/{workspace}/{repo_slug}" })
});
