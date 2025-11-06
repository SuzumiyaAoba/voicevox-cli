import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

// Docker なしでテストを実行する設定
export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
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
