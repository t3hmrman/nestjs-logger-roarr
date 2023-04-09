import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    passWithNoTests: true,
    include: [
      "test/**/*.int.ts",
      "test/int/**/*.ts",
    ],
  },
});
