import { defineCommand } from "citty";
import { t } from "@/i18n/index.js";
import { createCommand } from "./create.js";

// クエリコマンド
export const queryCommand = defineCommand({
  meta: {
    name: t("commands.query.name"),
    description: t("commands.query.description"),
  },
  subCommands: {
    create: createCommand,
  },
});
