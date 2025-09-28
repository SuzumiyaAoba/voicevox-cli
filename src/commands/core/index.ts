import { defineCommand } from "citty";
import { t } from "@/i18n/index.js";
import { coreVersionsCommand } from "./versions.js";

// コア関連コマンド
export const coreCommand = defineCommand({
  meta: {
    name: t("commands.core.name"),
    description: t("commands.core.description"),
  },
  subCommands: {
    versions: coreVersionsCommand,
  },
});
