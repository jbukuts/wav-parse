import { defineConfig, configDefaults } from 'vitest/config';

export default defineConfig({
  test: {
    exclude: [
      ...configDefaults.exclude,
      './demo/**',
      './demo/src/**',
      './node_modules/**'
    ],
    coverage: {
      provider: 'istanbul'
    }
  }
});
