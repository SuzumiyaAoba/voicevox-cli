import { defineCommand } from "citty";
import i18next from "@/i18n/config.js";
import { coreVersionsCommand } from "./versions.js";

// コア関連コマンド
export const coreCommand = defineCommand({
  meta: {
    name: i18next.t("commands.core.name"),
    description: i18next.t("commands.core.description"),
  },
  subCommands: {
    versions: coreVersionsCommand,
  },
});
