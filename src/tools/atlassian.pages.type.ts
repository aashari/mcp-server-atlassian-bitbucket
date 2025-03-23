import { z } from 'zod';

/**
 * Arguments for listing Confluence pages
 * Matches the controller's ListPagesOptions interface
 */
const ListPagesToolArgs = z.object({
	spaceId: z
		.array(z.string())
		.optional()
		.describe(
			'Filter pages by space IDs. Provide an array of space IDs (e.g., ["123456", "789012"]) to only show pages from specific spaces. Useful when you want to focus on content from particular projects or teams.',
		),
	status: z
		.array(
			z.enum([
				'current',
				'trashed',
				'deleted',
				'draft',
				'archived',
				'historical',
			]),
		)
		.optional()
		.describe(
			'Filter pages by status. Options include: "current" (published pages), "trashed" (pages in trash), "deleted" (permanently deleted), "draft" (unpublished drafts), "archived" (archived pages), or "historical" (previous versions). Defaults to "current" if not specified. Provide as an array to include multiple statuses.',
		),
	limit: z
		.number()
		.min(1)
		.max(250)
		.optional()
		.describe(
			'Maximum number of pages to return (1-250). Use this to control the response size. Useful for pagination or when you only need a few results. The Confluence API caps results at 250 items per request.',
		),
	cursor: z
		.string()
		.optional()
		.describe(
			'Pagination cursor for retrieving the next set of results. Use this to navigate through large result sets. The cursor value can be obtained from the pagination information in a previous response.',
		),
});

type ListPagesToolArgsType = z.infer<typeof ListPagesToolArgs>;

/**
 * Arguments for getting a specific Confluence page
 * Matches the controller's get function signature
 */
const GetPageToolArgs = z.object({
	id: z
		.string()
		.describe(
			'The numeric ID of the Confluence page to retrieve (e.g., "456789"). This is required and must be a valid page ID from your Confluence instance. The page content will be returned in Markdown format for easy reading.',
		),
});

type GetPageToolArgsType = z.infer<typeof GetPageToolArgs>;

export {
	ListPagesToolArgs,
	type ListPagesToolArgsType,
	GetPageToolArgs,
	type GetPageToolArgsType,
};
