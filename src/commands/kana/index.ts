/**
 * カナ関連ユーティリティコマンド
 *
 * カナ文字列の検証などのユーティリティコマンドを提供します。
 *
 * @module commands/kana
 */

import { defineCommand } from "citty";
import { validateCommand } from "./validate.js";

/**
 * カナ関連ユーティリティコマンド定義
 *
 * @example
 * ```bash
 * # カナ文字列を検証
 * voicevox kana validate "コンニチハ"
 * ```
 */
export const kanaCommand = defineCommand({
  meta: {
    name: "kana",
    description: "Kana utilities",
  },
  subCommands: {
    validate: validateCommand,
  },
});
