import { z } from 'zod';
import { CommonRepoIdentifierArgs } from './common.tool.types.js';

/**
 * Schema for the branch diff tool arguments
 */
export const BranchDiffArgsSchema = CommonRepoIdentifierArgs.extend({
	/**
	 * Source branch (feature branch)
	 */
	sourceBranch: z
		.string()
		.min(1, 'Source branch is required')
		.describe(
			'Source branch for comparison. IMPORTANT NOTE: The output displays as "destinationBranch → sourceBranch", and parameter naming can be counterintuitive. For full code diffs, try both parameter orders if initial results show only summary. Example: "feature/login-redesign"',
		),

	/**
	 * Destination branch (target branch like main/master)
	 */
	destinationBranch: z
		.string()
		.optional()
		.describe(
			'Destination branch for comparison. IMPORTANT NOTE: The output displays as "destinationBranch → sourceBranch", and parameter naming can be counterintuitive. For full code diffs, try both parameter orders if initial results show only summary. If not specified, defaults to "main". Example: "develop"',
		),

	/**
	 * Include full diff in the output
	 */
	includeFullDiff: z
		.boolean()
		.optional()
		.describe(
			'Whether to include the full code diff in the output. Defaults to true for rich output.',
		),

	/**
	 * Maximum number of files to return per page
	 */
	limit: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Maximum number of changed files to return in results'),

	/**
	 * Pagination cursor for retrieving additional results
	 */
	cursor: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Pagination cursor for retrieving additional results'),
});

export type BranchDiffArgsType = z.infer<typeof BranchDiffArgsSchema>;

/**
 * Schema for the commit diff tool arguments
 */
export const CommitDiffArgsSchema = CommonRepoIdentifierArgs.extend({
	sinceCommit: z
		.string()
		.min(1)
		.describe(
			'Base commit hash or reference. IMPORTANT NOTE: For proper results with code changes, this should be the NEWER commit (chronologically later). If you see "No changes detected", try reversing commit order.',
		),
	untilCommit: z
		.string()
		.min(1)
		.describe(
			'Target commit hash or reference. IMPORTANT NOTE: For proper results with code changes, this should be the OLDER commit (chronologically earlier). If you see "No changes detected", try reversing commit order.',
		),
	includeFullDiff: z
		.boolean()
		.optional()
		.describe(
			'Whether to include the full code diff in the response (default: false)',
		),
	limit: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Maximum number of changed files to return in results'),
	cursor: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Pagination cursor for retrieving additional results'),
});

export type CommitDiffArgsType = z.infer<typeof CommitDiffArgsSchema>;
