/**
 * コマンドヘルパーユーティリティ
 *
 * 共通のコマンドオプション定義を提供します。
 * すべてのコマンドで使用される基本的なオプション（baseUrl, json）を統一的に管理します。
 *
 * @module command-helpers
 */

import { t } from "@/i18n/config.js";

/**
 * ベースURLオプションの定義
 * VOICEVOX Engine APIのエンドポイントURLを指定するためのオプション
 */
export const baseUrlOption = {
  baseUrl: {
    type: "string" as const,
    description: "VOICEVOX Engine base URL (default: http://localhost:50021)",
    default: "http://localhost:50021",
  },
} as const;

/**
 * 共通のコマンドオプション定義（baseUrl, json）
 *
 * すべてのコマンドで共通して使用されるオプションを定義します。
 * - json: JSON形式で出力するかどうか
 * - baseUrl: VOICEVOX Engine APIのエンドポイント
 */
export const commonCommandOptions = {
  json: {
    type: "boolean" as const,
    description: t("common.args.json"),
    alias: "j" as const,
  },
  ...baseUrlOption,
} as const;

/**
 * コマンド引数定義のヘルパー型
 */
export type CommandArgs = typeof commonCommandOptions;
