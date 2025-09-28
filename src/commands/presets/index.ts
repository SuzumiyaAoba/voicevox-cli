import { defineCommand } from "citty";
import { t } from "@/i18n/index.js";
import { presetsAddCommand } from "./add.js";
import { presetsListCommand } from "./list.js";
import { presetsUpdateCommand } from "./update.js";

// プリセットコマンド
export const presetsCommand = defineCommand({
  meta: {
    name: t("commands.presets.name"),
    description: t("commands.presets.description"),
  },
  subCommands: {
    list: presetsListCommand,
    add: presetsAddCommand,
    update: presetsUpdateCommand,
  },
});
