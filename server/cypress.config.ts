/// <reference types="node" />

import { defineConfig } from 'cypress';

export default defineConfig({
  video: false,
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || 'http://localhost:9000',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: false,
  },
});
