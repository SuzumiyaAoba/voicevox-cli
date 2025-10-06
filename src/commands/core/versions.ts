/**
 * コアバージョン一覧コマンド
 *
 * VOICEVOX Engineの利用可能なコアバージョン一覧を取得して表示します。
 *
 * @module commands/core/versions
 */

import { defineCommand } from "citty";
import { z } from "zod";
import { t } from "@/i18n/config.js";
import { display, log } from "@/logger.js";
import { createClient, validateResponse } from "@/utils/api-helpers.js";
import { commonCommandOptions } from "@/utils/command-helpers.js";
import { handleError } from "@/utils/error-handler.js";
import { outputConditional } from "@/utils/output.js";
import { baseUrlSchema, validateArgs } from "@/utils/validation.js";

/**
 * コアバージョン一覧コマンド用のバリデーションスキーマ
 */
const engineVersionsSchema = z.object({
  baseUrl: baseUrlSchema.optional(),
  json: z.boolean().optional(),
});

/**
 * コアバージョン一覧コマンドの引数型
 */
export type EngineVersionsArgs = z.infer<typeof engineVersionsSchema>;

/**
 * コアバージョン一覧コマンド定義
 *
 * @example
 * ```bash
 * # コアバージョン一覧を表示
 * voicevox core versions
 *
 * # JSON形式で出力
 * voicevox core versions --json
 * ```
 */
export const coreVersionsCommand = defineCommand({
  meta: {
    name: t("commands.core.versions.name"),
    description: t("commands.core.versions.description"),
  },
  args: commonCommandOptions,
  async run({ args }) {
    try {
      // 引数のバリデーション
      const validatedArgs = validateArgs(engineVersionsSchema, args);

      log.debug("Starting core versions command", {
        baseUrl: validatedArgs.baseUrl,
      });

      const client = createClient(validatedArgs.baseUrl);

      display.info(t("commands.core.versions.fetching"));

      const response = await client.GET("/core_versions");
      const versions = validateResponse(
        response,
        "Invalid response format from core versions API",
        { baseUrl: validatedArgs.baseUrl },
      );

      log.debug("API response received", {
        hasData: !!versions,
        status: response.response?.status,
      });

      // 期待型: 文字列配列 もしくは 単一文字列
      const versionsSchema = z.union([z.array(z.string()), z.string()]);
      const parsed = versionsSchema.safeParse(versions);
      if (!parsed.success) {
        throw new Error("Invalid response format from core versions API");
      }
      const safeVersions = parsed.data;

      // 出力処理
      outputConditional(validatedArgs.json || false, safeVersions, () => {
        display.info(t("commands.core.versions.versionsFound"));

        if (Array.isArray(safeVersions)) {
          safeVersions.forEach((version, index) => {
            display.info(`${index + 1}. ${version}`);
          });
        } else {
          display.info(safeVersions);
        }
      });

      log.debug("Core versions command completed successfully", {
        versionsCount: Array.isArray(safeVersions) ? safeVersions.length : 1,
      });
    } catch (error) {
      handleError(error, "core-versions", {
        baseUrl: args.baseUrl,
      });
    }
  },
});
