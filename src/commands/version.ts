import { defineCommand } from "citty";
import packageJson from "../../package.json";

// バージョン情報表示コマンド
export const versionCommand = defineCommand({
  meta: {
    name: "version",
    description: "Show version information",
  },
  args: {},
  run() {
    console.log(`${packageJson.name} v${packageJson.version}`);
  },
});
