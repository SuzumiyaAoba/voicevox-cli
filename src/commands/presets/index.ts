/**
 * プリセット管理コマンド
 *
 * VOICEVOX Engineの音声合成プリセットを管理するためのコマンドグループ。
 * プリセットの一覧表示、追加、更新、削除のサブコマンドを提供します。
 *
 * @module commands/presets
 */

import { defineCommand } from "citty";
import i18next from "@/i18n/config.js";
import { presetsAddCommand } from "./add.js";
import { presetsDeleteCommand } from "./delete.js";
import { presetsListCommand } from "./list.js";
import { presetsUpdateCommand } from "./update.js";

/**
 * プリセット管理コマンド定義
 *
 * @example
 * ```bash
 * # プリセット一覧を表示
 * voicevox presets list
 *
 * # プリセットを追加
 * voicevox presets add --id 1 --name "カスタム"
 *
 * # プリセットを更新
 * voicevox presets update --id 1 --speed 1.5
 *
 * # プリセットを削除
 * voicevox presets delete --id 1
 * ```
 */
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
