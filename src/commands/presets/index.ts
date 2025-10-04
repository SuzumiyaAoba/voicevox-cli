import { defineCommand } from "citty";
import i18next from "@/i18n/config.js";
import { presetsAddCommand } from "./add.js";
import { presetsDeleteCommand } from "./delete.js";
import { presetsListCommand } from "./list.js";
import { presetsUpdateCommand } from "./update.js";

// プリセットコマンド
export const presetsCommand = defineCommand({
  meta: {
    name: i18next.t("commands.presets.name"),
    description: i18next.t("commands.presets.description"),
  },
  subCommands: {
    list: presetsListCommand,
    add: presetsAddCommand,
    update: presetsUpdateCommand,
    delete: presetsDeleteCommand,
  },
});
