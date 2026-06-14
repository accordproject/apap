#!/usr/bin/env node
/**
 * Wrapper around `npx reslate build` that works on Windows.
 *
 * reslate.js calls cp.spawn('npm.cmd', ...) without shell:true, which throws
 * EINVAL on Windows + Node 20+ because .cmd files require shell:true to be
 * spawned. This script replicates what reslate does but passes shell:true so
 * it works on all platforms without bypassing the docs build.
 *
 * See: https://github.com/Mermade/reslate (upstream fix pending)
 */

'use strict';

const { spawnSync } = require('child_process');
const path = require('path');

// Resolve the reslate package directory (same as __dirname inside reslate.js)
const reslateDir = path.dirname(require.resolve('reslate'));

// Replicate the env reslate sets up (see reslate.js)
const env = Object.assign({}, process.env, {
    SLATEDIR: path.relative(reslateDir, process.cwd()).replace(/\\/g, '/'),
    NODE_PATH: path.resolve(reslateDir, 'node_modules').replace(/\\/g, '/'),
});

const result = spawnSync('npm', ['run', 'build.local'], {
    stdio: 'inherit',
    cwd: reslateDir,
    env,
    shell: true, // required on Windows for npm (.cmd); harmless on Unix
});

process.exit(result.status ?? 1);
