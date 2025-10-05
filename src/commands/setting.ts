/**
 * 設定情報コマンド
 *
 * VOICEVOX Engineの設定を管理するコマンドを提供します。
 * サブコマンドとしてupdateコマンドを含みます。
 *
 * @module commands/setting
 */

import { defineCommand } from "citty";
import { t } from "@/i18n/config.js";
import { commonCommandOptions } from "@/utils/command-helpers.js";
import { settingUpdateCommand } from "./setting/update.js";

/**
 * 設定情報コマンド定義
 *
 * VOICEVOX Engineの設定を管理するためのコマンドグループ。
 *
 * @example
 * ```bash
 * # 設定を更新
 * voicevox setting update
 * ```
 */
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
