import { tailForAI, truncateForAI } from './formatter.util.js';

describe('tailForAI', () => {
	it('returns content within the limit unchanged', () => {
		const content = 'line 1\nline 2\n';
		expect(tailForAI(content, '/tmp/mcp/x.txt')).toBe(content);
	});

	it('keeps the end of oversized content, starting on a line boundary', () => {
		const lines = Array.from(
			{ length: 5000 },
			(_, i) => `log line ${i} ${'x'.repeat(20)}`,
		);
		const content = lines.join('\n');

		const result = tailForAI(content, null);

		expect(result.endsWith(lines[lines.length - 1])).toBe(true);
		expect(result).not.toContain('log line 0 ');
		const body = result.split('\n\n').slice(1).join('\n\n');
		expect(body.startsWith('log line ')).toBe(true);
		expect(result).toContain(`of ${content.length} chars`);
	});

	it('names the saved raw response path when given', () => {
		const content = 'y'.repeat(100000);
		expect(tailForAI(content, '/tmp/mcp/raw.txt')).toContain(
			'`/tmp/mcp/raw.txt`',
		);
	});

	it('stays within the truncateForAI limit so the tail is not cut again', () => {
		const content = 'z'.repeat(100000) + '\nFINAL ERROR LINE';
		const result = tailForAI(content, '/tmp/mcp/raw.txt');

		expect(truncateForAI(result, null)).toBe(result);
		expect(result.endsWith('FINAL ERROR LINE')).toBe(true);
	});
});
