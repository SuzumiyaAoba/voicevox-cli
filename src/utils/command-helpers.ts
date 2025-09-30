import { t } from "@/i18n/index.js";

export const baseUrlOption = {
  baseUrl: {
    type: "string" as const,
    description: "VOICEVOX Engine base URL (default: http://localhost:50021)",
    default: "http://localhost:50021",
  },
} as const;

/**
 * 共通のコマンドオプション定義（baseUrl, json）
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
