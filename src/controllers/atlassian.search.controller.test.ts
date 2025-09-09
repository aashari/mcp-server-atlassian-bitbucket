import atlassianSearchController from './atlassian.search.controller.js';
import { getAtlassianCredentials } from '../utils/transport.util.js';
import { config } from '../utils/config.util.js';
import { handleRepositoriesList } from './atlassian.repositories.list.controller.js';
import atlassianWorkspacesController from './atlassian.workspaces.controller.js';

describe('Atlassian Search Controller', () => {
	// Load configuration and check for credentials before all tests
	beforeAll(() => {
		config.load(); // Ensure config is loaded
		const credentials = getAtlassianCredentials();
		if (!credentials) {
			console.warn(
				'Skipping Atlassian Search Controller tests: No credentials available',
			);
		}
	});

	// Helper function to skip tests when credentials are missing
	const skipIfNoCredentials = () => !getAtlassianCredentials();

	// Helper to get valid repository information for testing
	async function getRepositoryInfo(): Promise<{
		workspaceSlug: string;
		repoSlug: string;
	} | null> {
		if (skipIfNoCredentials()) return null;

		try {
			// First get a workspace
			const workspacesResult = await atlassianWorkspacesController.list({
				limit: 1,
			});

			if (workspacesResult.content === 'No Bitbucket workspaces found.') {
				return null;
			}

			// Extract workspace slug
			const workspaceMatch = workspacesResult.content.match(
				/\*\*Slug\*\*:\s+([^\s\n]+)/,
			);
			const workspaceSlug = workspaceMatch ? workspaceMatch[1] : null;

			if (!workspaceSlug) return null;

			// Get a repository from this workspace
			const reposResult = await handleRepositoriesList({
				workspaceSlug,
				limit: 1,
			});

			if (
				reposResult.content ===
				'No repositories found in this workspace.'
			) {
				return null;
			}

			// Extract repo slug
			const repoSlugMatch = reposResult.content.match(
				/\*\*Slug\*\*:\s+([^\s\n]+)/,
			);
			const repoSlug = repoSlugMatch ? repoSlugMatch[1] : null;

			if (!repoSlug) return null;

			return { workspaceSlug, repoSlug };
		} catch (error) {
			console.warn(
				'Could not fetch repository info for search tests:',
				error,
			);
			return null;
		}
	}

	describe('search', () => {
		it('should search across all scopes when type=code', async () => {
			if (skipIfNoCredentials()) return;

			const repoInfo = await getRepositoryInfo();
			if (!repoInfo) {
				return; // Skip silently - no repository info available for testing
			}

			const result = await atlassianSearchController.search({
				workspace: repoInfo.workspaceSlug,
				repo: repoInfo.repoSlug,
				type: 'code',
				query: 'initial commit',
			});

			// Verify the response structure
			expect(result).toHaveProperty('content');
			expect(typeof result.content).toBe('string');

			// Should include code search results header
			expect(result.content).toContain('Code Search Results');
		}, 30000);

		it('should search only repositories when type=repositories', async () => {
			if (skipIfNoCredentials()) return;

			const repoInfo = await getRepositoryInfo();
			if (!repoInfo) {
				return; // Skip silently - no repository info available for testing
			}

			const result = await atlassianSearchController.search({
				workspace: repoInfo.workspaceSlug,
				type: 'repositories',
				query: repoInfo.repoSlug,
			});

			// Verify the response structure
			expect(result).toHaveProperty('content');
			expect(typeof result.content).toBe('string');

			// Should include only repository section
			expect(result.content).toContain('Repository Search Results');
			expect(result.content).not.toContain('Pull Request Search Results');
		}, 30000);

		it('should search only pull requests when type=pullrequests', async () => {
			if (skipIfNoCredentials()) return;

			const repoInfo = await getRepositoryInfo();
			if (!repoInfo) {
				return; // Skip silently - no repository info available for testing
			}

			const result = await atlassianSearchController.search({
				workspace: repoInfo.workspaceSlug,
				repo: repoInfo.repoSlug,
				type: 'pullrequests',
				query: 'test',
			});

			// Verify the response structure
			expect(result).toHaveProperty('content');
			expect(typeof result.content).toBe('string');

			// Should include only PR section
			expect(result.content).not.toContain('Repository Search Results');
			expect(result.content).toContain('Pull Request Search Results');
		}, 30000);

		it('should filter results with query parameter', async () => {
			if (skipIfNoCredentials()) return;

			const repoInfo = await getRepositoryInfo();
			if (!repoInfo) {
				return; // Skip silently - no repository info available for testing
			}

			// Use a query that might match something (repository name itself often works)
			const result = await atlassianSearchController.search({
				workspace: repoInfo.workspaceSlug,
				query: repoInfo.repoSlug,
				type: 'repositories',
			});

			// Verify the response structure
			expect(result).toHaveProperty('content');
			expect(typeof result.content).toBe('string');

			// If results are found, content should include the query term
			const resultsFound = !result.content.includes('No results found');
			if (resultsFound) {
				expect(result.content.toLowerCase()).toContain(
					repoInfo.repoSlug.toLowerCase(),
				);
			}
		}, 30000);

		it('should handle pagination options (limit/cursor)', async () => {
			if (skipIfNoCredentials()) return;

			const repoInfo = await getRepositoryInfo();
			if (!repoInfo) {
				return; // Skip silently - no repository info available for testing
			}

			// Fetch first page with limit 1
			const result1 = await atlassianSearchController.search({
				workspace: repoInfo.workspaceSlug,
				type: 'repositories',
				limit: 1,
				query: repoInfo.repoSlug,
			});

			// Extract pagination information from content
			const hasMoreResults = result1.content.includes(
				'More results are available.',
			);
			const cursorMatch = result1.content.match(
				/\*Next cursor: `([^`]+)`\*/,
			);
			const nextCursor = cursorMatch ? cursorMatch[1] : null;

			// If pagination is possible, test cursor-based pagination
			if (hasMoreResults && nextCursor) {
				const result2 = await atlassianSearchController.search({
					workspace: repoInfo.workspaceSlug,
					type: 'repositories',
					limit: 1,
					cursor: nextCursor,
					query: repoInfo.repoSlug,
				});

				// Both responses should have proper structure
				expect(result2).toHaveProperty('content');

				// The content should be different
				expect(result1.content).not.toEqual(result2.content);
			} else {
				console.warn(
					'Skipping cursor part of pagination test: Either no second page available or no items found.',
				);
			}
		}, 30000);

		it('should give an error when workspace is missing or empty', async () => {
			if (skipIfNoCredentials()) return;

			// Empty workspace should return an error message
			const result = await atlassianSearchController.search({
				type: 'repositories',
				workspace: '', // Empty workspace should trigger error
				query: 'test',
			});

			// Verify the response structure
			expect(result).toHaveProperty('content');
			expect(typeof result.content).toBe('string');

			// Content should include error message
			expect(result.content).toContain('Error:');
			expect(result.content).toContain('workspace');
		}, 30000);

		it('should work without a repo when type=repositories', async () => {
			if (skipIfNoCredentials()) return;

			const repoInfo = await getRepositoryInfo();
			if (!repoInfo) {
				return; // Skip silently - no repository info available for testing
			}

			// Should not throw an error when repo is missing but type is repositories
			const result = await atlassianSearchController.search({
				workspace: repoInfo.workspaceSlug,
				type: 'repositories',
				query: repoInfo.repoSlug,
			});

			// Verify the response structure
			expect(result).toHaveProperty('content');
			expect(typeof result.content).toBe('string');
		}, 30000);

		it('should require repo when type=pullrequests', async () => {
			if (skipIfNoCredentials()) return;

			const repoInfo = await getRepositoryInfo();
			if (!repoInfo) {
				return; // Skip silently - no repository info available for testing
			}

			// When searching pull requests without a repo, should return an error message
			const result = await atlassianSearchController.search({
				workspace: repoInfo.workspaceSlug,
				type: 'pullrequests',
				query: 'test',
				// Intentionally omit repo
			});

			// Content should include an error message
			expect(result.content).toContain('Error:');
			expect(result.content).toContain('required');
		}, 30000);

		it('should handle no results scenario', async () => {
			if (skipIfNoCredentials()) return;

			const repoInfo = await getRepositoryInfo();
			if (!repoInfo) {
				return; // Skip silently - no repository info available for testing
			}

			// Use a query string that will definitely not match anything
			const noMatchQuery = 'xzqwxtrv12345xyz987nonexistentstring';

			const result = await atlassianSearchController.search({
				workspace: repoInfo.workspaceSlug,
				query: noMatchQuery,
				type: 'code',
				repo: repoInfo.repoSlug,
			});

			// Verify the response structure
			expect(result).toHaveProperty('content');
			expect(typeof result.content).toBe('string');

			// Content should show no results
			expect(result.content).toContain('No code matches found');
		}, 30000);

		it('should handle errors for invalid workspace', async () => {
			if (skipIfNoCredentials()) return;

			const invalidWorkspace =
				'this-workspace-definitely-does-not-exist-12345';

			// Expect the controller call to reject when underlying controllers fail
			await expect(
				atlassianSearchController.search({
					workspace: invalidWorkspace,
					type: 'repositories',
					query: 'test-query', // Add a query to avoid the query validation error
				}),
			).rejects.toThrow();
		}, 30000);
	});
});
