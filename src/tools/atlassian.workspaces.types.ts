import { z } from 'zod';

/**
 * Workspaces tool types.
 *
 * NOTE: ListWorkspacesToolArgs has been deprecated.
 * The bb_ls_workspaces tool has been replaced by the generic bb_get tool.
 * Use: bb_get({ path: "/user/permissions/workspaces" })
 *
 * This file is kept for backwards compatibility with the CLI and controller.
 */

/**
 * Base pagination arguments for CLI/controller use
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
 * Schema for list-workspaces arguments (used by CLI/controller)
 */
export const ListWorkspacesToolArgs = z.object({
	...PaginationArgs,
});

export type ListWorkspacesToolArgsType = z.infer<typeof ListWorkspacesToolArgs>;
