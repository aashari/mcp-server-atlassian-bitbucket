import { Logger } from './logger.util.js';

const logger = Logger.forContext('utils/gcf.util.ts');

/**
 * GCF encodeGeneric function type (dynamically imported)
 */
type GcfEncodeGeneric = (input: unknown) => string;

/**
 * Cached GCF encodeGeneric function
 */
let gcfEncodeGeneric: GcfEncodeGeneric | null = null;

/**
 * Load the GCF encoder dynamically (ESM module in CommonJS project)
 */
async function loadGcfEncoder(): Promise<GcfEncodeGeneric | null> {
	if (gcfEncodeGeneric) {
		return gcfEncodeGeneric;
	}

	try {
		const gcf = await import('@blackwell-systems/gcf');
		gcfEncodeGeneric = gcf.encodeGeneric;
		logger.debug('GCF encoder loaded successfully');
		return gcfEncodeGeneric;
	} catch (error) {
		logger.error('Failed to load GCF encoder', error);
		return null;
	}
}

/**
 * Convert data to GCF format with JSON fallback
 *
 * Attempts to encode data as GCF (Generic Columnar Format) for
 * more efficient LLM token usage. Falls back to JSON if GCF encoding fails.
 *
 * @param data - The data to convert
 * @param jsonFallback - The JSON string to return if GCF conversion fails
 * @returns GCF formatted string, or JSON fallback on error
 *
 * @example
 * const json = JSON.stringify(data, null, 2);
 * const output = await toGcfOrJson(data, json);
 */
export async function toGcfOrJson(
	data: unknown,
	jsonFallback: string,
): Promise<string> {
	const methodLogger = logger.forMethod('toGcfOrJson');

	try {
		const encode = await loadGcfEncoder();
		if (!encode) {
			methodLogger.debug(
				'GCF encoder not available, using JSON fallback',
			);
			return jsonFallback;
		}

		const gcfResult = encode(data);
		methodLogger.debug('Successfully converted to GCF format');
		return gcfResult;
	} catch (error) {
		methodLogger.error(
			'GCF conversion failed, using JSON fallback',
			error,
		);
		return jsonFallback;
	}
}

/**
 * Synchronous GCF conversion with JSON fallback
 *
 * Uses cached encoder if available, otherwise returns JSON fallback.
 * Prefer toGcfOrJson for first-time conversion.
 *
 * @param data - The data to convert
 * @param jsonFallback - The JSON string to return if GCF is unavailable
 * @returns GCF formatted string, or JSON fallback
 */
export function toGcfOrJsonSync(data: unknown, jsonFallback: string): string {
	const methodLogger = logger.forMethod('toGcfOrJsonSync');

	if (!gcfEncodeGeneric) {
		methodLogger.debug('GCF encoder not loaded, using JSON fallback');
		return jsonFallback;
	}

	try {
		const gcfResult = gcfEncodeGeneric(data);
		methodLogger.debug('Successfully converted to GCF format');
		return gcfResult;
	} catch (error) {
		methodLogger.error(
			'GCF conversion failed, using JSON fallback',
			error,
		);
		return jsonFallback;
	}
}

/**
 * Pre-load the GCF encoder for synchronous usage later
 * Call this during server initialization
 */
export async function preloadGcfEncoder(): Promise<boolean> {
	const encode = await loadGcfEncoder();
	return encode !== null;
}
