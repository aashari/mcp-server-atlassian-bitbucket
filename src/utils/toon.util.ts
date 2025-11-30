import { Logger } from './logger.util.js';

const logger = Logger.forContext('utils/toon.util.ts');

/**
 * TOON encode function type (dynamically imported)
 */
type ToonEncode = (input: unknown, options?: { indent?: number }) => string;

/**
 * Cached TOON encode function
 */
let toonEncode: ToonEncode | null = null;

/**
 * Load the TOON encoder dynamically (ESM module in CommonJS project)
 */
async function loadToonEncoder(): Promise<ToonEncode | null> {
	if (toonEncode) {
		return toonEncode;
	}

	try {
		const toon = await import('@toon-format/toon');
		toonEncode = toon.encode;
		logger.debug('TOON encoder loaded successfully');
		return toonEncode;
	} catch (error) {
		logger.error('Failed to load TOON encoder', error);
		return null;
	}
}

/**
 * Convert data to TOON format with JSON fallback
 *
 * Attempts to encode data as TOON (Token-Oriented Object Notation) for
 * more efficient LLM token usage. Falls back to JSON if TOON encoding fails.
 *
 * @param data - The data to convert
 * @param jsonFallback - The JSON string to return if TOON conversion fails
 * @returns TOON formatted string, or JSON fallback on error
 *
 * @example
 * const json = JSON.stringify(data, null, 2);
 * const output = await toToonOrJson(data, json);
 */
export async function toToonOrJson(
	data: unknown,
	jsonFallback: string,
): Promise<string> {
	const methodLogger = logger.forMethod('toToonOrJson');

	try {
		const encode = await loadToonEncoder();
		if (!encode) {
			methodLogger.debug(
				'TOON encoder not available, using JSON fallback',
			);
			return jsonFallback;
		}

		const toonResult = encode(data, { indent: 2 });
		methodLogger.debug('Successfully converted to TOON format');
		return toonResult;
	} catch (error) {
		methodLogger.error(
			'TOON conversion failed, using JSON fallback',
			error,
		);
		return jsonFallback;
	}
}

/**
 * Synchronous TOON conversion with JSON fallback
 *
 * Uses cached encoder if available, otherwise returns JSON fallback.
 * Prefer toToonOrJson for first-time conversion.
 *
 * @param data - The data to convert
 * @param jsonFallback - The JSON string to return if TOON is unavailable
 * @returns TOON formatted string, or JSON fallback
 */
export function toToonOrJsonSync(data: unknown, jsonFallback: string): string {
	const methodLogger = logger.forMethod('toToonOrJsonSync');

	if (!toonEncode) {
		methodLogger.debug('TOON encoder not loaded, using JSON fallback');
		return jsonFallback;
	}

	try {
		const toonResult = toonEncode(data, { indent: 2 });
		methodLogger.debug('Successfully converted to TOON format');
		return toonResult;
	} catch (error) {
		methodLogger.error(
			'TOON conversion failed, using JSON fallback',
			error,
		);
		return jsonFallback;
	}
}

/**
 * Pre-load the TOON encoder for synchronous usage later
 * Call this during server initialization
 */
export async function preloadToonEncoder(): Promise<boolean> {
	const encode = await loadToonEncoder();
	return encode !== null;
}
