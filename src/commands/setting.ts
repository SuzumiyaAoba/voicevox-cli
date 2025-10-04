import { defineCommand } from "citty";
import { t } from "@/i18n/index.js";
import { commonCommandOptions } from "@/utils/command-helpers.js";
import { settingUpdateCommand } from "./setting/update.js";

// 設定情報コマンド
export const settingCommand = defineCommand({
  meta: {
    name: t("commands.setting.name"),
    description: t("commands.setting.description"),
  },
  subCommands: {
    update: settingUpdateCommand,
  },
  args: commonCommandOptions,
});
