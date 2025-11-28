import jmespath from 'jmespath';
import { Logger } from './logger.util.js';

const logger = Logger.forContext('utils/jq.util.ts');

/**
 * Apply a JMESPath filter to JSON data
 *
 * @param data - The data to filter (any JSON-serializable value)
 * @param filter - JMESPath expression to apply
 * @returns Filtered data or original data if filter is empty/invalid
 *
 * @example
 * // Get single field
 * applyJqFilter(data, "name")
 *
 * // Get nested field
 * applyJqFilter(data, "links.html.href")
 *
 * // Get multiple fields as object
 * applyJqFilter(data, "{name: name, slug: slug}")
 *
 * // Array operations
 * applyJqFilter(data, "values[*].name")
 */
export function applyJqFilter(data: unknown, filter?: string): unknown {
	const methodLogger = logger.forMethod('applyJqFilter');

	// Return original data if no filter provided
	if (!filter || filter.trim() === '') {
		methodLogger.debug('No filter provided, returning original data');
		return data;
	}

	try {
		methodLogger.debug(`Applying JMESPath filter: ${filter}`);
		const result = jmespath.search(data, filter);
		methodLogger.debug('Filter applied successfully');
		return result;
	} catch (error) {
		methodLogger.error(`Invalid JMESPath expression: ${filter}`, error);
		// Return original data with error info if filter is invalid
		return {
			_jqError: `Invalid JMESPath expression: ${filter}`,
			_originalData: data,
		};
	}
}

/**
 * Convert data to JSON string for MCP response
 *
 * @param data - The data to stringify
 * @param pretty - Whether to pretty-print the JSON (default: true)
 * @returns JSON string
 */
export function toJsonString(data: unknown, pretty: boolean = true): string {
	if (pretty) {
		return JSON.stringify(data, null, 2);
	}
	return JSON.stringify(data);
}
