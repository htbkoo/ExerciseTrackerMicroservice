// To eliminate the unnecessary settings from jest.config.js
// noinspection JSUnusedLocalSymbols
const {
    setupFiles,
    globalTeardown,
    globalSetup,
    testEnvironment,
    ...baseConfig
} = require("./jest.config");

module.exports = {
    ...baseConfig,
    "displayName": "Unit tests",
    testMatch: [
        '**/test/**/*.test.(ts|js)'
    ],
    testEnvironment: 'node',
};