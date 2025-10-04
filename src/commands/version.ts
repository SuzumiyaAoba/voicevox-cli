import { defineCommand } from "citty";
import i18next from "@/i18n/config.js";
import packageJson from "../../package.json";

// バージョン情報表示コマンド
export const versionCommand = defineCommand({
  meta: {
    name: i18next.t("commands.version.name"),
    description: i18next.t("commands.version.description"),
  },
  args: {},
  run() {
    console.log(`${packageJson.name} v${packageJson.version}`);
  },
});
