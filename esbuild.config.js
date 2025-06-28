/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import esbuild from 'esbuild';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);
const pkg = require(path.resolve(__dirname, 'package.json'));

esbuild
  .build({
    entryPoints: ['packages/cli/index.ts'],
    bundle: true,
    outfile: 'bundle/gemini.js',
    platform: 'node',
    format: 'esm',
    external: [
      // All npm packages should be external (not bundled)
      'ink',
      'dotenv',
      'command-exists',
      'ansi-escapes',
      'update-notifier',
      'ink-gradient',
      'ink-spinner',
      'ink-select-input',
      'ink-big-text',
      'ink-link',
      'ink-text-input',
      'diff',
      '@google/genai',
      'gaxios',
      'html-to-text',
      'google-auth-library',
      'simple-git',
      'undici',
      'open',
      'lowlight',
      'react',
      'read-package-up',
      'shell-quote',
      'string-width',
      'strip-ansi',
      'strip-json-comments',
      'yargs',
      'mime-types',
      'highlight.js',
      'glob',
      '@modelcontextprotocol/sdk',
      '@opentelemetry/api',
      '@opentelemetry/semantic-conventions',
      '@opentelemetry/exporter-trace-otlp-grpc',
      '@opentelemetry/exporter-logs-otlp-grpc',
      '@opentelemetry/exporter-metrics-otlp-grpc',
      '@opentelemetry/api-logs',
      '@opentelemetry/otlp-exporter-base',
      '@opentelemetry/sdk-node',
      '@opentelemetry/resources',
      '@opentelemetry/sdk-trace-node',
      '@opentelemetry/sdk-logs',
      '@opentelemetry/sdk-metrics',
      '@opentelemetry/instrumentation-http',
      'ignore',
      'micromatch',
      'ws',
      // Node.js built-in modules
      'node:fs',
      'node:path',
      'node:url',
      'node:util',
      'node:os',
      'node:crypto',
      'node:events',
      'node:stream',
      'node:buffer',
      'node:process',
      'node:child_process',
      'node:cluster',
      'node:net',
      'node:tls',
      'node:http',
      'node:https',
      'node:zlib',
      'node:readline',
      'node:repl',
      'node:vm',
      'node:assert',
      'node:module',
      'fs',
      'path',
      'url',
      'util',
      'os',
      'crypto',
      'events',
      'stream',
      'buffer',
      'process',
      'child_process',
      'cluster',
      'net',
      'tls',
      'http',
      'https',
      'zlib',
      'readline',
      'repl',
      'vm',
      'assert',
      'module',
    ],
    define: {
      'process.env.CLI_VERSION': JSON.stringify(pkg.version),
    },
    banner: {
      js: `import { createRequire } from 'module'; const require = createRequire(import.meta.url); globalThis.__filename = require('url').fileURLToPath(import.meta.url); globalThis.__dirname = require('path').dirname(globalThis.__filename);`,
    },
  })
  .catch(() => process.exit(1));
