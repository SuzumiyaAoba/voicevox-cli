/**
 * コア関連コマンド
 *
 * VOICEVOX Engineのコア情報を取得するためのコマンドグループ。
 * コアバージョン情報などのサブコマンドを提供します。
 *
 * @module commands/core
 */

import { defineCommand } from "citty";
import { t } from "@/i18n/config.js";
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
    name: t("commands.core.name"),
    description: t("commands.core.description"),
  },
  subCommands: {
    versions: coreVersionsCommand,
  },
});
