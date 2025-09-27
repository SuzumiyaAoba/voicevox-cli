import { defineConfig } from "vitest/config";

// Docker なしでテストを実行する設定
export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    // globalSetup を無効にしてDockerを起動しない
    coverage: {
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "dist/", "**/*.d.ts"],
    },
    testTimeout: 10000,
    hookTimeout: 10000,
  },
});
