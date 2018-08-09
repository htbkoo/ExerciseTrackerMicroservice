module.exports = {
    globals: {
        'ts-jest': {
            tsConfigFile: 'tsconfig.json'
        }
    },
    moduleFileExtensions: [
        'ts',
        'js'
    ],
    transform: {
        '^.+\\.(ts|tsx)$': './node_modules/ts-jest/preprocessor.js'
    },
    testMatch: [
        '**/test/**/*.(test|spec).(ts|js)'
    ],
    testEnvironment: 'node',
    setupFiles: ["./test/setupTests.ts"],
    globalTeardown: "./test/globalTeardown.js",
    globalSetup: "./test/globalSetup.js",
    testPathIgnorePatterns: ["/node_modules/", "/dist/.*"]
};