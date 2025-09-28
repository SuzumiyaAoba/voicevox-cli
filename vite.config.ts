import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  build: {
    // 出力ディレクトリ
    outDir: "dist",
    // ソースマップを生成
    sourcemap: true,
    // ターゲット環境
    target: "node18",
    // ライブラリモードでビルド
    lib: {
      entry: "./src/index.ts",
      formats: ["es"],
      fileName: "index",
    },
    // 外部依存関係をバンドルに含めない
    rollupOptions: {
      external: [
        // Node.jsの組み込みモジュール
        "fs",
        "path",
        "os",
        "util",
        "stream",
        "events",
        "child_process",
        "node:child_process",
        "crypto",
        "url",
        "querystring",
        "http",
        "https",
        "zlib",
        "buffer",
        "process",
        "assert",
        "constants",
        "timers",
        "tty",
        "readline",
        "repl",
        "vm",
        "worker_threads",
        "cluster",
        "net",
        "dgram",
        "dns",
        "tls",
        "perf_hooks",
        "async_hooks",
        "trace_events",
        "v8",
        "inspector",
        "module",
        "punycode",
        "string_decoder",
        "sys",
        "domain",
        "freelist",
        "smalloc",
      ],
      output: {
        // エントリーポイントのファイル名
        entryFileNames: "index.js",
        // チャンクファイル名
        chunkFileNames: "[name].js",
        // アセットファイル名
        assetFileNames: "[name].[ext]",
      },
    },
  },
  // 依存関係の最適化
  optimizeDeps: {
    include: ["citty", "pino", "pino-pretty"],
  },
});
