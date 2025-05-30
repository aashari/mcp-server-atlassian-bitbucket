/**
 * Default values for pagination across the application.
 * These values should be used consistently throughout the codebase.
 */

/**
 * Default page size for all list operations.
 * This value determines how many items are returned in a single page by default.
 */
export const DEFAULT_PAGE_SIZE = 25;

/**
 * Apply default values to options object.
 * This utility ensures that default values are consistently applied.
 *
 * @param options Options object that may have some values undefined
 * @param defaults Default values to apply when options values are undefined
 * @returns Options object with default values applied
 *
 * @example
 * const options = applyDefaults({ limit: 10 }, { limit: DEFAULT_PAGE_SIZE, includeBranches: true });
 * // Result: { limit: 10, includeBranches: true }
 */
export function applyDefaults<T extends object>(
	options: Partial<T>,
	defaults: Partial<T>,
): T {
	return {
		...defaults,
		...Object.fromEntries(
			Object.entries(options).filter(([_, value]) => value !== undefined),
		),
	} as T;
}
