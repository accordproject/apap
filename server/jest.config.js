// `npm test` runs Node with --no-compilation-cache. template-engine runs
// TypeScript trigger logic through an eval'd import(), and V8 reuses that
// compiled code across test files in the same Jest worker. Without the flag,
// the second file to run a real trigger imports through the first file's
// torn-down environment and fails with "Test environment has been torn down".
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: [ '**/?(*.)+(spec|test).ts?(x)' ],
    // @a2a-js/sdk@1.0.1's CJS bundle imports its nested ESM-only jose@6.
    // Node >=22.12 supports that require path, but Jest 29 does not. Tests use
    // the pinned jose@5 CJS build; pretest separately loads the real SDK path.
    moduleNameMapper: {
      '^jose$': '<rootDir>/node_modules/jose/dist/node/cjs/index.js'
    },
    setupFiles: ['<rootDir>/jest.setup.js']
};