import { defineCommand } from "citty";

// バージョン情報表示コマンド
export const versionCommand = defineCommand({
  meta: {
    name: "version",
    description: "Show version information",
  },
  args: {},
  run() {
    console.log("voicevox-cli v0.1.0");
  },
});
