const baseConfig = require("./jest.config");

module.exports = {
    ...baseConfig,
    displayName: "All tests",
    testMatch: [
        '**/test/**/*.(test|spec).(ts|js)'
    ],
    setupFiles: ["./test/setupTests.ts"],
    globalTeardown: "./test/globalTeardown.js",
    globalSetup: "./test/globalSetup.js",
    testEnvironment: './test/mongo-environment.js',
};