import { z } from 'zod';

/**
 * @fileoverview Tool argument schemas for Bitbucket Issues MCP tools
 * Defines Zod schemas for validating tool arguments
 */

/**
 * Schema for listing issues tool arguments
 */
export const ListIssuesToolArgs = z.object({
	workspaceSlug: z.string().describe('Workspace identifier'),
	repoSlug: z.string().describe('Repository identifier'),
	status: z
		.enum([
			'new',
			'open',
			'resolved',
			'on hold',
			'invalid',
			'duplicate',
			'wontfix',
			'closed',
		])
		.optional()
		.describe('Filter by issue status'),
	kind: z
		.enum(['bug', 'enhancement', 'proposal', 'task'])
		.optional()
		.describe('Filter by issue kind'),
	priority: z
		.enum(['trivial', 'minor', 'major', 'critical', 'blocker'])
		.optional()
		.describe('Filter by priority'),
	query: z
		.string()
		.optional()
		.describe(
			'BBQL (Bitbucket Query Language) filter expression. ' +
				'Syntax: field operator value. ' +
				'Operators: ~ (contains), = (equals), !=, >, >=, <, <=. ' +
				'Logical: AND, OR. ' +
				'Common fields: title, content.raw, state, priority, kind, reporter.display_name. ' +
				'Examples: title ~ "bug", state="open" AND priority>="major", content.raw ~ "auth"',
		),
	sort: z
		.string()
		.optional()
		.describe(
			'Sort field (e.g., "created_on", "-updated_on" for descending)',
		),
	limit: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Maximum number of issues to return (default: 10)'),
	page: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Page number for pagination'),
});

/**
 * Schema for getting a single issue tool arguments
 */
export const GetIssueToolArgs = z.object({
	workspaceSlug: z.string().describe('Workspace identifier'),
	repoSlug: z.string().describe('Repository identifier'),
	issueId: z.number().int().positive().describe('Issue ID number'),
});

/**
 * Schema for creating an issue tool arguments
 */
export const CreateIssueToolArgs = z.object({
	workspaceSlug: z.string().describe('Workspace identifier'),
	repoSlug: z.string().describe('Repository identifier'),
	title: z.string().min(1).describe('Issue title'),
	content: z.string().optional().describe('Issue description in markdown'),
	kind: z
		.enum(['bug', 'enhancement', 'proposal', 'task'])
		.optional()
		.describe('Issue kind (default: bug)'),
	priority: z
		.enum(['trivial', 'minor', 'major', 'critical', 'blocker'])
		.optional()
		.describe('Issue priority (default: major)'),
});

/**
 * Schema for updating an issue tool arguments
 */
export const UpdateIssueToolArgs = z.object({
	workspaceSlug: z.string().describe('Workspace identifier'),
	repoSlug: z.string().describe('Repository identifier'),
	issueId: z.number().int().positive().describe('Issue ID number'),
	title: z.string().optional().describe('New issue title'),
	content: z.string().optional().describe('New issue description'),
	status: z.string().optional().describe('New status'),
	kind: z
		.enum(['bug', 'enhancement', 'proposal', 'task'])
		.optional()
		.describe('New issue kind'),
	priority: z
		.enum(['trivial', 'minor', 'major', 'critical', 'blocker'])
		.optional()
		.describe('New priority'),
	assignee: z.string().optional().describe('UUID of user to assign to issue'),
});

/**
 * Schema for deleting an issue tool arguments
 */
export const DeleteIssueToolArgs = z.object({
	workspaceSlug: z.string().describe('Workspace identifier'),
	repoSlug: z.string().describe('Repository identifier'),
	issueId: z.number().int().positive().describe('Issue ID to delete'),
});

/**
 * Schema for listing issue comments tool arguments
 */
export const ListIssueCommentsToolArgs = z.object({
	workspaceSlug: z.string().describe('Workspace identifier'),
	repoSlug: z.string().describe('Repository identifier'),
	issueId: z.number().int().positive().describe('Issue ID number'),
	limit: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Maximum number of comments (default: 20)'),
	page: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Page number for pagination'),
});

/**
 * Schema for adding a comment to an issue tool arguments
 */
export const AddIssueCommentToolArgs = z.object({
	workspaceSlug: z.string().describe('Workspace identifier'),
	repoSlug: z.string().describe('Repository identifier'),
	issueId: z.number().int().positive().describe('Issue ID number'),
	content: z.string().min(1).describe('Comment content in markdown'),
});

// Export TypeScript types inferred from schemas
export type ListIssuesToolArgsType = z.infer<typeof ListIssuesToolArgs>;
export type GetIssueToolArgsType = z.infer<typeof GetIssueToolArgs>;
export type CreateIssueToolArgsType = z.infer<typeof CreateIssueToolArgs>;
export type UpdateIssueToolArgsType = z.infer<typeof UpdateIssueToolArgs>;
export type DeleteIssueToolArgsType = z.infer<typeof DeleteIssueToolArgs>;
export type ListIssueCommentsToolArgsType = z.infer<
	typeof ListIssueCommentsToolArgs
>;
export type AddIssueCommentToolArgsType = z.infer<
	typeof AddIssueCommentToolArgs
>;
