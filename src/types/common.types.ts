/**
 * Common type definitions shared across controllers.
 * These types provide a standard interface for controller interactions.
 * Centralized here to ensure consistency across the codebase.
 */

/**
 * Common pagination information for API responses.
 * This is used for providing consistent pagination details internally.
 * Its formatted representation will be included directly in the content string.
 */
export interface ResponsePagination {
	/**
	 * Cursor for the next page of results, if available.
	 * This should be passed to subsequent requests to retrieve the next page.
	 */
	nextCursor?: string;

	/**
	 * Whether more results are available beyond the current page.
	 * When true, clients should use the nextCursor to retrieve more results.
	 */
	hasMore: boolean;

	/**
	 * The number of items in the current result set.
	 * This helps clients track how many items they've received.
	 */
	count?: number;

	/**
	 * The total number of items available across all pages, if known.
	 * Note: Not all APIs provide this. Check the specific API/tool documentation.
	 */
	total?: number;

	/**
	 * Page number for page-based pagination.
	 */
	page?: number;

	/**
	 * Page size for page-based pagination.
	 */
	size?: number;
}

/**
 * Common response structure for controller operations.
 * All controller methods should return this structure.
 */
export interface ControllerResponse {
	/**
	 * Formatted content to be displayed to the user.
	 * Contains a comprehensive Markdown-formatted string that includes all information:
	 * - Primary content (e.g., list items, details)
	 * - Any metadata (previously in metadata field)
	 * - Pagination information (previously in pagination field)
	 */
	content: string;

	/**
	 * Optional path to the raw API response file.
	 * When the response is truncated, this path allows AI to access the full data.
	 */
	rawResponsePath?: string | null;
}
