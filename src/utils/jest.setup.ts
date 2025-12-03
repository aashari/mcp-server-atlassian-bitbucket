/**
 * Jest global setup for suppressing console output during tests
 * This file is used to mock console methods to reduce noise in test output
 */

import { jest, beforeEach, afterEach, afterAll } from '@jest/globals';

// Store original console methods
const originalConsole = {
	log: console.log,
	info: console.info,
	warn: console.warn,
	error: console.error,
	debug: console.debug,
};

// Global setup to suppress console output during tests
beforeEach(() => {
	// Mock console methods to suppress output
	console.log = jest.fn();
	console.info = jest.fn();
	console.warn = jest.fn();
	console.error = jest.fn();
	console.debug = jest.fn();
});

afterEach(() => {
	// Clear mock calls after each test
	jest.clearAllMocks();
});

afterAll(() => {
	// Restore original console methods after all tests
	console.log = originalConsole.log;
	console.info = originalConsole.info;
	console.warn = originalConsole.warn;
	console.error = originalConsole.error;
	console.debug = originalConsole.debug;
});
