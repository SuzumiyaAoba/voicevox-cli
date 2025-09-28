import { defineCommand } from "citty";
import { t } from "../../i18n/index.js";
import { engineVersionCommand } from "./version.js";

// エンジン関連コマンド
export const engineCommand = defineCommand({
  meta: {
    name: t("commands.engine.name"),
    description: t("commands.engine.description"),
  },
  subCommands: {
    version: engineVersionCommand,
  },
});
