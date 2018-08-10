const baseConfig = require("./jest.config");

module.exports = {
    ...baseConfig,
    "displayName": "Unit tests",
    testMatch: [
        '**/test/**/*.test.(ts|js)'
    ],
    testEnvironment: 'node',
};