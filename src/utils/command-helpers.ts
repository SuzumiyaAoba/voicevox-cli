import { t } from "@/i18n/index.js";
import { baseUrlOption } from "@/options.js";

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
};

/**
 * コマンド引数定義のヘルパー型
 */
export type CommandArgs = typeof commonCommandOptions;
