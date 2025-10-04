/**
 * コア関連コマンド
 *
 * VOICEVOX Engineのコア情報を取得するためのコマンドグループ。
 * コアバージョン情報などのサブコマンドを提供します。
 *
 * @module commands/core
 */

import { defineCommand } from "citty";
import i18next from "@/i18n/config.js";
import { coreVersionsCommand } from "./versions.js";

/**
 * コア関連コマンド定義
 *
 * @example
 * ```bash
 * # コアバージョン一覧を表示
 * voicevox core versions
 * ```
 */
export const coreCommand = defineCommand({
  meta: {
    name: i18next.t("commands.core.name"),
    description: i18next.t("commands.core.description"),
  },
  subCommands: {
    versions: coreVersionsCommand,
  },
});
