/// <reference types="vitest" />
/// <reference types="node" />

import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/setup.ts'],
    include: ['./tests/**/*.{test,spec}.{ts,tsx}'],
    exclude: [
      'node_modules/',
      '.git/',
      '.next/',
      'coverage/',
      'tests/load/',  // Load tests use k6, not vitest
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'tests/setup.ts',
        'tests/fixtures/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/index.ts',
        'src/app/**',
        'src/components/**',
      ],
      reportsDirectory: './coverage',
    },
    reporters: ['default', 'hanging-process'],
    testTimeout: 15000,
    hookTimeout: 10000,
    teardownTimeout: 30000,
    silent: false,
    watch: false,
  },
  css: {
    postcss: false,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/lib': path.resolve(__dirname, './src/lib'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/app': path.resolve(__dirname, './src/app'),
    },
  },
});
