module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: [ '**/?(*.)+(spec|test).ts?(x)' ],
    // @a2a-js/sdk@1.0.1's CJS bundle imports its nested ESM-only jose@6.
    // Node >=22.12 supports that require path, but Jest 29 does not. Tests use
    // the pinned jose@5 CJS build; pretest separately loads the real SDK path.
    moduleNameMapper: {
      '^jose$': '<rootDir>/node_modules/jose/dist/node/cjs/index.js'
    }
  };
