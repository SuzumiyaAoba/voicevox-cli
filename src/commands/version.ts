import { defineCommand } from "citty";
import { t } from "@/i18n/index.js";
import packageJson from "../../package.json";

// バージョン情報表示コマンド
export const versionCommand = defineCommand({
  meta: {
    name: t("commands.version.name"),
    description: t("commands.version.description"),
  },
  args: {},
  run() {
    console.log(`${packageJson.name} v${packageJson.version}`);
  },
});
