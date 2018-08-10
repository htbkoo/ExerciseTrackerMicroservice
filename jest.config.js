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
};