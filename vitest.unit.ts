import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    passWithNoTests: true,
    include: [
      "test/**/*.unit.ts",
      "test/unit/**/*.ts",
    ],
  },
});
