import { z } from 'zod';

export const CommonToolPaginationArgs = z.object({
	limit: z
		.number()
		.int()
		.positive()
		.max(100)
		.optional()
		.describe(
			'Maximum number of items to return (1-100). Controls the response size. Defaults to a predefined page size (e.g., 25) if omitted.',
		),
	cursor: z
		.string()
		.optional()
		.describe(
			'Pagination cursor (e.g., page number or token) for retrieving the next set of results. Obtained from a previous response when more results are available.',
		),
});

// Common Repository Identifier Arguments
export const CommonRepoIdentifierArgs = z.object({
	workspaceSlug: z
		.string()
		.optional()
		.describe(
			'Workspace slug. If not provided, the system will try to use a default workspace. Example: "myteam"',
		),
	repoSlug: z
		.string()
		.min(1, 'Repository slug is required')
		.describe('Repository slug. Example: "project-api"'),
});

// Common Pull Request Identifier Arguments
// This extends CommonRepoIdentifierArgs
export const CommonPullRequestIdentifierArgs = CommonRepoIdentifierArgs.extend({
	prId: z
		.string()
		.min(1, 'Pull request ID is required')
		.describe('Numeric ID of the pull request as a string. Example: "42"'),
});
