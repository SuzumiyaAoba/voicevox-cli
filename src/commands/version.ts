import { defineCommand } from "citty";
import packageJson from "../../package.json";
import { t } from "../i18n/index.js";

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
