import { defineCommand } from "citty";
import i18next from "@/i18n/config.js";
import { createCommand } from "./create.js";
import { validateKanaCommand } from "./validate-kana.js";

// クエリコマンド
export const queryCommand = defineCommand({
  meta: {
    name: i18next.t("commands.query.name"),
    description: i18next.t("commands.query.description"),
  },
  subCommands: {
    create: createCommand,
    "validate-kana": validateKanaCommand,
  },
});
