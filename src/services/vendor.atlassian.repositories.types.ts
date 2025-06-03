import { z } from 'zod';

/**
 * Types for Atlassian Bitbucket Repositories API
 */

// Link href schema
const LinkSchema = z.object({
	href: z.string(),
	name: z.string().optional(),
});

/**
 * Repository SCM type
 */
export const RepositorySCMSchema = z.enum(['git', 'hg']);

/**
 * Repository fork policy
 */
export const RepositoryForkPolicySchema = z.enum([
	'allow_forks',
	'no_public_forks',
	'no_forks',
]);

/**
 * Repository links object
 */
export const RepositoryLinksSchema = z.object({
	self: LinkSchema.optional(),
	html: LinkSchema.optional(),
	avatar: LinkSchema.optional(),
	pullrequests: LinkSchema.optional(),
	commits: LinkSchema.optional(),
	forks: LinkSchema.optional(),
	watchers: LinkSchema.optional(),
	downloads: LinkSchema.optional(),
	clone: z.array(LinkSchema).optional(),
	hooks: LinkSchema.optional(),
	issues: LinkSchema.optional(),
});

/**
 * Repository owner links schema
 */
const OwnerLinksSchema = z.object({
	self: LinkSchema.optional(),
	html: LinkSchema.optional(),
	avatar: LinkSchema.optional(),
});

/**
 * Repository owner object
 */
export const RepositoryOwnerSchema = z.object({
	type: z.enum(['user', 'team']),
	username: z.string().optional(),
	display_name: z.string().optional(),
	uuid: z.string().optional(),
	links: OwnerLinksSchema.optional(),
});

/**
 * Repository branch object
 */
export const RepositoryBranchSchema = z.object({
	type: z.literal('branch'),
	name: z.string(),
});

/**
 * Repository project links schema
 */
const ProjectLinksSchema = z.object({
	self: LinkSchema.optional(),
	html: LinkSchema.optional(),
});

/**
 * Repository project object
 */
export const RepositoryProjectSchema = z.object({
	type: z.literal('project'),
	key: z.string(),
	uuid: z.string(),
	name: z.string(),
	links: ProjectLinksSchema.optional(),
});

/**
 * Repository object returned from the API
 */
export const RepositorySchema = z.object({
	type: z.literal('repository'),
	uuid: z.string(),
	full_name: z.string(),
	name: z.string(),
	description: z.string().optional(),
	is_private: z.boolean(),
	fork_policy: RepositoryForkPolicySchema.optional(),
	created_on: z.string().optional(),
	updated_on: z.string().optional(),
	size: z.number().optional(),
	language: z.string().optional(),
	has_issues: z.boolean().optional(),
	has_wiki: z.boolean().optional(),
	scm: RepositorySCMSchema,
	owner: RepositoryOwnerSchema,
	mainbranch: RepositoryBranchSchema.optional(),
	project: RepositoryProjectSchema.optional(),
	links: RepositoryLinksSchema,
});
export type Repository = z.infer<typeof RepositorySchema>;

/**
 * Parameters for listing repositories
 */
export const ListRepositoriesParamsSchema = z.object({
	workspace: z.string(),
	q: z.string().optional(),
	sort: z.string().optional(),
	page: z.number().optional(),
	pagelen: z.number().optional(),
	role: z.string().optional(),
});
export type ListRepositoriesParams = z.infer<
	typeof ListRepositoriesParamsSchema
>;

/**
 * Parameters for getting a repository by identifier
 */
export const GetRepositoryParamsSchema = z.object({
	workspace: z.string(),
	repo_slug: z.string(),
});
export type GetRepositoryParams = z.infer<typeof GetRepositoryParamsSchema>;

/**
 * API response for listing repositories
 */
export const RepositoriesResponseSchema = z.object({
	pagelen: z.number(),
	page: z.number(),
	size: z.number(),
	next: z.string().optional(),
	previous: z.string().optional(),
	values: z.array(RepositorySchema),
});
export type RepositoriesResponse = z.infer<typeof RepositoriesResponseSchema>;

// --- Commit History Types ---

/**
 * Parameters for listing commits.
 */
export const ListCommitsParamsSchema = z.object({
	workspace: z.string(),
	repo_slug: z.string(),
	include: z.string().optional(), // Branch, tag, or hash to include history from
	exclude: z.string().optional(), // Branch, tag, or hash to exclude history up to
	path: z.string().optional(), // File path to filter commits by
	page: z.number().optional(),
	pagelen: z.number().optional(),
});
export type ListCommitsParams = z.infer<typeof ListCommitsParamsSchema>;

/**
 * Commit author user links schema
 */
const CommitAuthorUserLinksSchema = z.object({
	self: LinkSchema.optional(),
	avatar: LinkSchema.optional(),
});

/**
 * Commit author user schema
 */
const CommitAuthorUserSchema = z.object({
	display_name: z.string().optional(),
	nickname: z.string().optional(),
	account_id: z.string().optional(),
	uuid: z.string().optional(),
	type: z.string(), // Usually 'user'
	links: CommitAuthorUserLinksSchema.optional(),
});

/**
 * Commit author schema
 */
export const CommitAuthorSchema = z.object({
	raw: z.string(),
	type: z.string(), // Usually 'author'
	user: CommitAuthorUserSchema.optional(),
});

/**
 * Commit links schema
 */
const CommitLinksSchema = z.object({
	self: LinkSchema.optional(),
	html: LinkSchema.optional(),
	diff: LinkSchema.optional(),
	approve: LinkSchema.optional(),
	comments: LinkSchema.optional(),
});

/**
 * Commit summary schema
 */
const CommitSummarySchema = z.object({
	raw: z.string().optional(),
	markup: z.string().optional(),
	html: z.string().optional(),
});

/**
 * Commit parent schema
 */
const CommitParentSchema = z.object({
	hash: z.string(),
	type: z.string(),
	links: z.unknown(),
});

/**
 * Represents a single commit in the history.
 */
export const CommitSchema = z.object({
	hash: z.string(),
	type: z.string(), // Usually 'commit'
	author: CommitAuthorSchema,
	date: z.string(), // ISO 8601 format date string
	message: z.string(),
	links: CommitLinksSchema,
	summary: CommitSummarySchema.optional(),
	parents: z.array(CommitParentSchema),
});
export type Commit = z.infer<typeof CommitSchema>;

/**
 * API response for listing commits (paginated).
 */
export const PaginatedCommitsSchema = z.object({
	pagelen: z.number().optional(),
	page: z.number().optional(),
	size: z.number().optional(),
	next: z.string().optional(),
	previous: z.string().optional(),
	values: z.array(CommitSchema),
});
export type PaginatedCommits = z.infer<typeof PaginatedCommitsSchema>;

/**
 * Parameters for creating a branch.
 */
export const CreateBranchParamsSchema = z.object({
	workspace: z.string(),
	repo_slug: z.string(),
	name: z.string(), // New branch name
	target: z.object({
		hash: z.string(), // Source branch name or commit hash
	}),
});
export type CreateBranchParams = z.infer<typeof CreateBranchParamsSchema>;

/**
 * Response object when creating a branch.
 * Contains details about the newly created branch reference.
 */
export const BranchRefSchema = z.object({
	type: z.literal('branch'),
	name: z.string(),
	target: z.object({
		hash: z.string(),
		type: z.string(), // e.g., 'commit'
	}),
});
export type BranchRef = z.infer<typeof BranchRefSchema>;

/**
 * Parameters for getting a file's content from a repository.
 */
export const GetFileContentParamsSchema = z.object({
	workspace: z.string(),
	repo_slug: z.string(),
	commit: z.string(), // Branch name, tag, or commit hash
	path: z.string(), // File path within the repository
});
export type GetFileContentParams = z.infer<typeof GetFileContentParamsSchema>;

/**
 * Represents a branch target (usually a commit).
 */
export const BranchTargetSchema = z.object({
	hash: z.string(),
	type: z.string(), // Usually 'commit'
});

/**
 * Represents a branch in a Bitbucket repository.
 */
export const BranchSchema = z.object({
	name: z.string(),
	type: z.literal('branch'),
	target: BranchTargetSchema,
	merge_strategies: z.array(z.string()).optional(),
	default_merge_strategy: z.string().optional(),
	links: z.record(z.string(), z.unknown()).optional(),
});

/**
 * Parameters for listing branches in a repository.
 */
export const ListBranchesParamsSchema = z.object({
	workspace: z.string(),
	repo_slug: z.string(),
	page: z.number().optional(),
	pagelen: z.number().optional(),
	q: z.string().optional(), // Query for filtering branches
	sort: z.string().optional(), // Sort field
});
export type ListBranchesParams = z.infer<typeof ListBranchesParamsSchema>;

/**
 * API response for listing branches (paginated).
 */
export const BranchesResponseSchema = z.object({
	pagelen: z.number(),
	page: z.number().optional(),
	size: z.number().optional(),
	next: z.string().optional(),
	previous: z.string().optional(),
	values: z.array(BranchSchema),
});
export type BranchesResponse = z.infer<typeof BranchesResponseSchema>;
