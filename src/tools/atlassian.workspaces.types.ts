import { z } from 'zod';

/**
 * Base pagination arguments for all tools
 */
const PaginationArgs = {
	limit: z
		.number()
		.int()
		.positive()
		.max(100)
		.optional()
		.describe(
			'Maximum number of items to return (1-100). Controls the response size. Defaults to 25 if omitted.',
		),

	cursor: z
		.string()
		.optional()
		.describe(
			'Pagination cursor for retrieving the next set of results. Obtained from previous response when more results are available.',
		),
};

/**
 * Schema for list-workspaces tool arguments
 */
export const ListWorkspacesToolArgs = z.object({
	/**
	 * Maximum number of workspaces to return and pagination
	 */
	...PaginationArgs,
});

export type ListWorkspacesToolArgsType = z.infer<typeof ListWorkspacesToolArgs>;
