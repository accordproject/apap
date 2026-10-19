'use strict';

// Runs outside Jest so it exercises the SDK's real CommonJS -> ESM jose@6
// dependency path. Jest 29 uses a jose@5 mapper solely for its VM sandbox.
const server = require('@a2a-js/sdk/server');
const express = require('@a2a-js/sdk/server/express');

if (typeof server.DefaultRequestHandler !== 'function' || typeof express.jsonRpcHandler !== 'function') {
    throw new Error('The installed @a2a-js/sdk server runtime is not loadable.');
}

console.log('A2A SDK runtime dependency check passed.');
