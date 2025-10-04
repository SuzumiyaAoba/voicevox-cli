import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  test: {
    globals: true,
    environment: "node",
    globalSetup: "./test/setup.ts",
    coverage: {
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "dist/", "**/*.d.ts"],
    },
    // テストタイムアウトを延長（Docker起動時間を考慮）
    testTimeout: 30000,
    hookTimeout: 30000,
  },
});
