import { isStepLogPath } from './atlassian.api.controller.js';
import { DEFAULT_ACCEPT_HEADER } from '../utils/transport.util.js';

describe('isStepLogPath', () => {
	it.each([
		'/repositories/ws/repo/pipelines/22/steps/{b13cd567-fe2b-45e9-a79a-c85dc4d64852}/log',
		'/2.0/repositories/ws/repo/pipelines/{uuid}/steps/{uuid}/log',
		'/repositories/ws/repo/pipelines/22/steps/{uuid}/log/',
		'/repositories/ws/repo/pipelines/22/steps/{uuid}/log?page=1',
	])('matches %s', (path) => {
		expect(isStepLogPath(path)).toBe(true);
	});

	it.each([
		'/repositories/ws/repo/pipelines/22/steps',
		'/repositories/ws/repo/pipelines/22/steps/{uuid}',
		'/repositories/ws/repo/pipelines/22/steps/{uuid}/logs',
		'/repositories/ws/repo/pipelines/22/steps/{uuid}/log/extra',
		'/repositories/ws/repo/src/main/log',
		'/repositories/ws/repo/pullrequests/1/diff',
	])('does not match %s', (path) => {
		expect(isStepLogPath(path)).toBe(false);
	});
});

describe('DEFAULT_ACCEPT_HEADER', () => {
	it('prefers JSON but accepts other representations', () => {
		const ranges = DEFAULT_ACCEPT_HEADER.split(',').map((r) => r.trim());
		expect(ranges[0]).toBe('application/json');
		expect(ranges).toContain('*/*;q=0.8');
	});
});
