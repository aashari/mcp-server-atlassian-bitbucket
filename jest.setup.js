// Jest setup file to suppress console warnings during tests
// This improves test output readability while maintaining error visibility

const originalConsoleWarn = console.warn;
const originalConsoleInfo = console.info;
const originalConsoleDebug = console.debug;

beforeAll(() => {
  // Suppress console.warn, console.info, and console.debug during tests
  // while keeping console.error for actual issues
  console.warn = jest.fn();
  console.info = jest.fn();
  console.debug = jest.fn();
});

afterAll(() => {
  // Restore original console methods
  console.warn = originalConsoleWarn;
  console.info = originalConsoleInfo;
  console.debug = originalConsoleDebug;
});