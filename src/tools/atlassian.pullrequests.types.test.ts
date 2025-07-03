import { CreatePullRequestCommentToolArgs } from './atlassian.pullrequests.types';

describe('Atlassian Pull Requests Tool Types', () => {
	describe('CreatePullRequestCommentToolArgs Schema', () => {
		it('should accept valid parentId parameter for comment replies', () => {
			const validArgs = {
				repoSlug: 'test-repo',
				prId: '123',
				content: 'This is a reply to another comment',
				parentId: '456',
			};
			
			const result = CreatePullRequestCommentToolArgs.safeParse(validArgs);
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.parentId).toBe('456');
				expect(result.data.repoSlug).toBe('test-repo');
				expect(result.data.prId).toBe('123');
				expect(result.data.content).toBe('This is a reply to another comment');
			}
		});

		it('should work without parentId parameter for top-level comments', () => {
			const validArgs = {
				repoSlug: 'test-repo',
				prId: '123',
				content: 'This is a top-level comment',
			};
			
			const result = CreatePullRequestCommentToolArgs.safeParse(validArgs);
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.parentId).toBeUndefined();
				expect(result.data.repoSlug).toBe('test-repo');
				expect(result.data.prId).toBe('123');
				expect(result.data.content).toBe('This is a top-level comment');
			}
		});

		it('should accept both parentId and inline parameters together', () => {
			const validArgs = {
				repoSlug: 'test-repo',
				prId: '123',
				content: 'Reply with inline comment',
				parentId: '456',
				inline: {
					path: 'src/main.ts',
					line: 42,
				},
			};
			
			const result = CreatePullRequestCommentToolArgs.safeParse(validArgs);
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.parentId).toBe('456');
				expect(result.data.inline?.path).toBe('src/main.ts');
				expect(result.data.inline?.line).toBe(42);
			}
		});

		it('should require required fields even with parentId', () => {
			const invalidArgs = {
				parentId: '456', // parentId alone is not enough
			};
			
			const result = CreatePullRequestCommentToolArgs.safeParse(invalidArgs);
			expect(result.success).toBe(false);
		});

		it('should accept optional workspaceSlug with parentId', () => {
			const validArgs = {
				workspaceSlug: 'my-workspace',
				repoSlug: 'test-repo',
				prId: '123',
				content: 'Reply comment',
				parentId: '456',
			};
			
			const result = CreatePullRequestCommentToolArgs.safeParse(validArgs);
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.workspaceSlug).toBe('my-workspace');
				expect(result.data.parentId).toBe('456');
			}
		});
	});
}); 