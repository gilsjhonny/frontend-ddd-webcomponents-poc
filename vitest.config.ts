import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: './src/tests/setup.ts',
    coverage: {
      exclude: ['**/types.ts', '**/*.d.ts', '**/setup.ts', './vitest.config.ts', './eslint.config.js', '**/Mock*.ts'],
    },
  },
});
