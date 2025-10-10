import { z } from 'zod';

/**
 * @fileoverview Type definitions and Zod schemas for Bitbucket Issues API
 * @see https://developer.atlassian.com/cloud/bitbucket/rest/api-group-issue-tracker/
 */

/**
 * Schema for issue content object
 */
export const IssueContentSchema = z.object({
	raw: z.string(),
	markup: z.string().optional(),
	html: z.string().optional(),
});

/**
 * Schema for user/account object in issues
 */
export const IssueUserSchema = z.object({
	display_name: z.string(),
	uuid: z.string(),
	account_id: z.string().optional(),
	nickname: z.string().optional(),
});

/**
 * Schema for issue links
 */
export const IssueLinksSchema = z.object({
	self: z
		.object({
			href: z.string(),
		})
		.optional(),
	html: z
		.object({
			href: z.string(),
		})
		.optional(),
	comments: z
		.object({
			href: z.string(),
		})
		.optional(),
	attachments: z
		.object({
			href: z.string(),
		})
		.optional(),
	watch: z
		.object({
			href: z.string(),
		})
		.optional(),
	vote: z
		.object({
			href: z.string(),
		})
		.optional(),
});

/**
 * Schema for a single issue
 */
export const IssueSchema = z.object({
	id: z.number(),
	title: z.string(),
	content: IssueContentSchema.optional(),
	reporter: IssueUserSchema.optional(),
	assignee: IssueUserSchema.optional().nullable(),
	state: z.string().optional(),
	kind: z.string().optional(),
	priority: z.string().optional(),
	created_on: z.string().optional(),
	updated_on: z.string().optional(),
	edited_on: z.string().optional().nullable(),
	votes: z.number().optional(),
	watches: z.number().optional(),
	links: IssueLinksSchema.optional(),
	type: z.string().optional(),
});

/**
 * Schema for paginated issue list response
 */
export const IssueListSchema = z.object({
	values: z.array(IssueSchema),
	page: z.number().optional(),
	pagelen: z.number().optional(),
	size: z.number().optional(),
	next: z.string().optional(),
});

/**
 * Schema for issue comment
 */
export const IssueCommentSchema = z.object({
	id: z.number(),
	content: z.object({
		raw: z.string(),
		markup: z.string().optional(),
		html: z.string().optional(),
	}),
	user: IssueUserSchema.optional(),
	created_on: z.string().optional(),
	updated_on: z.string().optional(),
	links: z
		.object({
			self: z
				.object({
					href: z.string(),
				})
				.optional(),
			html: z
				.object({
					href: z.string(),
				})
				.optional(),
		})
		.optional(),
	type: z.string().optional(),
});

/**
 * Schema for paginated comment list response
 */
export const CommentListSchema = z.object({
	values: z.array(IssueCommentSchema),
	page: z.number().optional(),
	pagelen: z.number().optional(),
	size: z.number().optional(),
	next: z.string().optional(),
});

// TypeScript types inferred from schemas
export type IssueContent = z.infer<typeof IssueContentSchema>;
export type IssueUser = z.infer<typeof IssueUserSchema>;
export type IssueLinks = z.infer<typeof IssueLinksSchema>;
export type Issue = z.infer<typeof IssueSchema>;
export type IssueListResponse = z.infer<typeof IssueListSchema>;
export type IssueComment = z.infer<typeof IssueCommentSchema>;
export type CommentListResponse = z.infer<typeof CommentListSchema>;

/**
 * Parameters for listing issues
 */
export interface ListIssuesParams {
	workspace: string;
	repo_slug: string;
	status?: string;
	kind?: string;
	priority?: string;
	q?: string;
	sort?: string;
	pagelen?: number;
	page?: number;
}

/**
 * Parameters for getting a single issue
 */
export interface GetIssueParams {
	workspace: string;
	repo_slug: string;
	issue_id: number;
}

/**
 * Parameters for creating an issue
 */
export interface CreateIssueParams {
	workspace: string;
	repo_slug: string;
	title: string;
	content?: string;
	kind?: string;
	priority?: string;
}

/**
 * Parameters for updating an issue
 */
export interface UpdateIssueParams {
	workspace: string;
	repo_slug: string;
	issue_id: number;
	title?: string;
	content?: string;
	status?: string;
	kind?: string;
	priority?: string;
	assignee?: string;
}

/**
 * Parameters for deleting an issue
 */
export interface DeleteIssueParams {
	workspace: string;
	repo_slug: string;
	issue_id: number;
}

/**
 * Parameters for listing comments on an issue
 */
export interface ListCommentsParams {
	workspace: string;
	repo_slug: string;
	issue_id: number;
	pagelen?: number;
	page?: number;
}

/**
 * Parameters for adding a comment to an issue
 */
export interface AddCommentParams {
	workspace: string;
	repo_slug: string;
	issue_id: number;
	content: string;
}
