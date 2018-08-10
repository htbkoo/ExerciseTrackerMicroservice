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
    testPathIgnorePatterns: ["/node_modules/", "/dist/.*"],
    testMatch: [
        '**/test/**/*.(test|spec).(ts|js)'
    ],
    setupFiles: ["./test/setupTests.ts"],
    globalTeardown: "./test/globalTeardown.js",
    globalSetup: "./test/globalSetup.js",
    testEnvironment: './test/mongo-environment.js',
};