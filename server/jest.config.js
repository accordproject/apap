module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: [ '**/?(*.)+(spec|test).ts?(x)' ],
    // @a2a-js/sdk@1.0.1's CJS bundle imports its nested ESM-only jose@6.
    // Node 24 supports that require path, but Jest 29 does not. Tests use the
    // explicitly pinned jose@5 CJS build, whose APIs used by the SDK are the same.
    moduleNameMapper: {
      '^jose$': '<rootDir>/node_modules/jose/dist/node/cjs/index.js'
    }
  };
