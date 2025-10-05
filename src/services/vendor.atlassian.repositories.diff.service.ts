import { z } from 'zod';
import { Logger } from '../utils/logger.util.js';
import { NETWORK_TIMEOUTS } from '../utils/constants.util.js';
import {
	fetchAtlassian,
	getAtlassianCredentials,
} from '../utils/transport.util.js';
import {
	createApiError,
	createAuthMissingError,
	McpError,
} from '../utils/error.util.js';
import {
	GetDiffstatParamsSchema,
	DiffstatResponseSchema,
	GetRawDiffParamsSchema,
	type GetDiffstatParams,
	type DiffstatResponse,
	type GetRawDiffParams,
} from './vendor.atlassian.repositories.diff.types.js';

/**
 * Base API path for Bitbucket REST API v2
 */
const API_PATH = '/2.0';

const serviceLogger = Logger.forContext(
	'services/vendor.atlassian.repositories.diff.service.ts',
);
serviceLogger.debug('Bitbucket diff service initialised');

/**
 * Retrieve diffstat (per–file summary) between two refs (branches, tags or commits).
 * Follows Bitbucket Cloud endpoint:
 *   GET /2.0/repositories/{workspace}/{repo_slug}/diffstat/{spec}
 */
export async function getDiffstat(
	params: GetDiffstatParams,
): Promise<DiffstatResponse> {
	const methodLogger = serviceLogger.forMethod('getDiffstat');
	methodLogger.debug('Fetching diffstat with params', params);

	// Validate params
	try {
		GetDiffstatParamsSchema.parse(params);
	} catch (err) {
		if (err instanceof z.ZodError) {
			throw createApiError(
				`Invalid parameters: ${err.issues.map((e) => e.message).join(', ')}`,
				400,
				err,
			);
		}
		throw err;
	}

	const credentials = getAtlassianCredentials();
	if (!credentials) {
		throw createAuthMissingError('Atlassian credentials are required');
	}

	const query = new URLSearchParams();
	if (params.pagelen) query.set('pagelen', String(params.pagelen));
	if (params.cursor) query.set('page', String(params.cursor));
	if (params.topic !== undefined) query.set('topic', String(params.topic));

	const queryString = query.toString() ? `?${query.toString()}` : '';
	const encodedSpec = encodeURIComponent(params.spec);
	const path = `${API_PATH}/repositories/${params.workspace}/${params.repo_slug}/diffstat/${encodedSpec}${queryString}`;

	methodLogger.debug(`Requesting: ${path}`);
	try {
		const rawData = await fetchAtlassian(credentials, path);
		try {
			const validated = DiffstatResponseSchema.parse(rawData);
			return validated;
		} catch (error) {
			if (error instanceof z.ZodError) {
				methodLogger.error(
					'Bitbucket API response validation failed:',
					error.format(),
				);
				throw createApiError(
					`Invalid response format from Bitbucket API for diffstat: ${error.message}`,
					500,
					error,
				);
			}
			throw error; // Re-throw any other errors
		}
	} catch (error) {
		if (error instanceof McpError) throw error;
		throw createApiError(
			`Failed to fetch diffstat: ${error instanceof Error ? error.message : String(error)}`,
			500,
			error,
		);
	}
}

/**
 * Retrieve raw unified diff between two refs.
 * Endpoint: /diff/{spec}
 */
export async function getRawDiff(params: GetRawDiffParams): Promise<string> {
	const methodLogger = serviceLogger.forMethod('getRawDiff');
	methodLogger.debug('Fetching raw diff', params);
	try {
		GetRawDiffParamsSchema.parse(params);
	} catch (err) {
		if (err instanceof z.ZodError) {
			throw createApiError(
				`Invalid parameters: ${err.issues.map((e) => e.message).join(', ')}`,
				400,
				err,
			);
		}
		throw err;
	}
	const credentials = getAtlassianCredentials();
	if (!credentials) {
		throw createAuthMissingError('Atlassian credentials are required');
	}

	const encodedSpec = encodeURIComponent(params.spec);
	const path = `${API_PATH}/repositories/${params.workspace}/${params.repo_slug}/diff/${encodedSpec}`;
	methodLogger.debug(`Requesting: ${path}`);
	try {
		// fetchAtlassian will return string for text/plain
		const diffText = await fetchAtlassian<string>(credentials, path, {
			timeout: NETWORK_TIMEOUTS.LARGE_REQUEST_TIMEOUT,
		});
		return diffText;
	} catch (error) {
		if (error instanceof McpError) throw error;
		throw createApiError(
			`Failed to fetch raw diff: ${error instanceof Error ? error.message : String(error)}`,
			500,
			error,
		);
	}
}
