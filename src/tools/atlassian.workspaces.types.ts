import { z } from 'zod';

import { CommonToolPaginationArgs } from './common.tool.types.js';

/**
 * Schema for list-workspaces tool arguments
 */
export const ListWorkspacesToolArgs = CommonToolPaginationArgs.extend(
	{},
).describe('Arguments for listing Bitbucket workspaces.');

export type ListWorkspacesToolArgsType = z.infer<typeof ListWorkspacesToolArgs>;

/**
 * Schema for get-workspace tool arguments
 */
export const GetWorkspaceToolArgs = z.object({
	/**
	 * Workspace slug to retrieve
	 */
	workspaceSlug: z
		.string()
		.min(1, 'Workspace slug is required')
		.describe(
			'Workspace slug to retrieve detailed information for. Must be a valid workspace slug from your Bitbucket account. Example: "myteam"',
		),
});

export type GetWorkspaceToolArgsType = z.infer<typeof GetWorkspaceToolArgs>;
