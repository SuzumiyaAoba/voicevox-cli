/**
 * 音声クエリコマンド
 *
 * 音声合成用のクエリを生成・検証するためのコマンドグループ。
 * クエリ生成、カナ検証のサブコマンドを提供します。
 *
 * @module commands/query
 */

import { defineCommand } from "citty";
import { t } from "@/i18n/config.js";
import { createCommand } from "./create.js";
import { validateKanaCommand } from "./validate-kana.js";

/**
 * 音声クエリコマンド定義
 *
 * @example
 * ```bash
 * # 音声クエリを生成
 * voicevox query create "こんにちは" --speaker 2
 *
 * # カナ文字列を検証
 * voicevox query validate-kana "コンニチハ"
 * ```
 */
export const queryCommand = defineCommand({
  meta: {
    name: t("commands.query.name"),
    description: t("commands.query.description"),
  },
  subCommands: {
    create: createCommand,
    "validate-kana": validateKanaCommand,
  },
});
