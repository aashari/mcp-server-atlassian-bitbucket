import { Logger } from './logger.util.js';
import { ResponsePagination } from '../types/common.types.js';

/**
 * Represents the possible pagination types.
 */
export enum PaginationType {
	CURSOR = 'cursor', // Confluence, Bitbucket (some endpoints)
	OFFSET = 'offset', // Jira
	PAGE = 'page', // Bitbucket (most endpoints)
}

/**
 * Interface representing the common structure of paginated data from APIs.
 * This union type covers properties used by offset, cursor, and page-based pagination.
 */
interface PaginationData {
	// Shared
	results?: unknown[];
	values?: unknown[];
	count?: number;
	size?: number; // Total count in Bitbucket page responses
	hasMore?: boolean;
	_links?: { next?: string }; // Confluence cursor
	// Offset-based (Jira)
	startAt?: number;
	maxResults?: number;
	total?: number;
	nextPage?: string; // Alternative next indicator for offset
	// Page-based (Bitbucket)
	page?: number;
	pagelen?: number;
	next?: string; // Bitbucket page URL
}

/**
 * Extract pagination information from API response
 * @param data The API response containing pagination information
 * @param paginationType The type of pagination mechanism used
 * @returns Object with nextCursor, hasMore, and count properties
 */
export function extractPaginationInfo<T extends Partial<PaginationData>>(
	data: T,
	paginationType: PaginationType,
): ResponsePagination | undefined {
	if (!data) {
		return undefined;
	}

	let pagination: ResponsePagination | undefined;
	const methodLogger = Logger.forContext(
		'utils/pagination.util.ts',
		'extractPaginationInfo',
	);

	switch (paginationType) {
		case PaginationType.PAGE: {
			// Bitbucket page-based pagination (page, pagelen, size, next)
			if (data.page !== undefined && data.pagelen !== undefined) {
				const hasMore = !!data.next;
				let nextCursorValue: string | undefined = undefined;

				if (hasMore) {
					try {
						// First attempt to parse the full URL if it looks like one
						if (
							typeof data.next === 'string' &&
							data.next.includes('://')
						) {
							const nextUrl = new URL(data.next);
							nextCursorValue =
								nextUrl.searchParams.get('page') || undefined;
							methodLogger.debug(
								`Successfully extracted page from URL: ${nextCursorValue}`,
							);
						} else if (data.next === 'available') {
							// Handle the 'available' placeholder used in some transformedResponses
							nextCursorValue = String(Number(data.page) + 1);
							methodLogger.debug(
								`Using calculated next page from 'available': ${nextCursorValue}`,
							);
						} else if (typeof data.next === 'string') {
							// Try to use data.next directly if it's not a URL but still a string
							nextCursorValue = data.next;
							methodLogger.debug(
								`Using next value directly: ${nextCursorValue}`,
							);
						}
					} catch (e) {
						// If URL parsing fails, calculate the next page based on current page
						nextCursorValue = String(Number(data.page) + 1);
						methodLogger.debug(
							`Calculated next page after URL parsing error: ${nextCursorValue}`,
						);
						methodLogger.warn(
							`Failed to parse next URL: ${data.next}`,
							e,
						);
					}
				}

				pagination = {
					hasMore,
					count: data.values?.length ?? 0,
					page: data.page,
					size: data.pagelen,
					total: data.size,
					nextCursor: nextCursorValue, // Store next page number as cursor
				};
			}
			break;
		}

		case PaginationType.OFFSET: {
			// Jira offset-based pagination
			const countOffset = data.values?.length;
			if (
				data.startAt !== undefined &&
				data.maxResults !== undefined &&
				data.total !== undefined &&
				data.startAt + data.maxResults < data.total
			) {
				pagination = {
					hasMore: true,
					count: countOffset,
					total: data.total,
					nextCursor: String(data.startAt + data.maxResults),
				};
			} else if (data.nextPage) {
				pagination = {
					hasMore: true,
					count: countOffset,
					nextCursor: data.nextPage,
				};
			}
			break;
		}

		case PaginationType.CURSOR: {
			// Confluence cursor-based pagination
			const countCursor = data.results?.length;
			if (data._links && data._links.next) {
				const nextUrl = data._links.next;
				const cursorMatch = nextUrl.match(/cursor=([^&]+)/);
				if (cursorMatch && cursorMatch[1]) {
					pagination = {
						hasMore: true,
						count: countCursor,
						nextCursor: decodeURIComponent(cursorMatch[1]),
					};
				}
			}
			break;
		}

		default:
			methodLogger.warn(`Unknown pagination type: ${paginationType}`);
	}

	// Ensure a default pagination object if none was created but data exists
	if (!pagination && (data.results || data.values)) {
		pagination = {
			hasMore: false,
			count: data.results?.length ?? data.values?.length ?? 0,
		};
	}

	return pagination;
}
