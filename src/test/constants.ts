/**
 * Test Constants
 * Centralized test configuration values
 * @follows DRY - Single source of truth for test values
 */

// HTTP Status Codes
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
} as const;

// Test Entity IDs
export const TEST_IDS = {
    DEFAULT: 1,
    RESTAURANT: 1,
    USER: 1,
    ORDER_TAKER: 1,
    CHEF: 1,
} as const;

// Test Dates
export const TEST_DATES = {
    DEFAULT: '2024-01-01T00:00:00Z',
    RECENT: '2024-12-01T00:00:00Z',
    OLD: '2023-01-01T00:00:00Z',
} as const;

// Test Prices
export const TEST_PRICES = {
    DEFAULT: 10.99,
    LOW: 5.00,
    MEDIUM: 15.50,
    HIGH: 50.00,
} as const;

// Test Selectors
export const SELECTORS = {
    LOADING_SPINNER: '.MuiCircularProgress-root',
    ERROR_MESSAGE: '[data-testid="error-message"]',
    SUCCESS_MESSAGE: '[data-testid="success-message"]',
    TABLE_ROW: '[data-testid="table-row"]',
} as const;

// Test Timeouts
export const TIMEOUTS = {
    SHORT: 1000,
    MEDIUM: 3000,
    LONG: 5000,
} as const;

// Test User Data
export const TEST_USERS = {
    WAITER: {
        name: 'Test Waiter',
        email: 'waiter@test.com',
    },
    CHEF: {
        name: 'Test Chef',
        email: 'chef@test.com',
    },
    ADMIN: {
        name: 'Test Admin',
        email: 'admin@test.com',
    },
} as const;
