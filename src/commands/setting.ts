import { defineCommand } from "citty";
import i18next from "@/i18n/config.js";
import { commonCommandOptions } from "@/utils/command-helpers.js";
import { settingUpdateCommand } from "./setting/update.js";

// 設定情報コマンド
export const settingCommand = defineCommand({
  meta: {
    name: i18next.t("commands.setting.name"),
    description: i18next.t("commands.setting.description"),
  },
  subCommands: {
    update: settingUpdateCommand,
  },
  args: commonCommandOptions,
});
