import { defineCommand } from "citty";
import { t } from "@/i18n/index.js";
import { display, log } from "@/logger.js";
import { baseUrlOption } from "@/options.js";
import { createVoicevoxClient } from "@/utils/client.js";
import {
  ErrorType,
  handleError,
  VoicevoxError,
} from "@/utils/error-handler.js";
import { engineVersionsSchema, validateArgs } from "@/utils/validation.js";

// コアバージョン一覧コマンド
export const coreVersionsCommand = defineCommand({
  meta: {
    name: t("commands.core.versions.name"),
    description: t("commands.core.versions.description"),
  },
  args: {
    json: {
      type: "boolean",
      description: t("commands.core.versions.args.json"),
      alias: "j",
    },
    ...baseUrlOption,
  },
  async run({ args }) {
    try {
      // 引数のバリデーション
      const validatedArgs = validateArgs(engineVersionsSchema, args);

      log.debug("Starting core versions command", {
        baseUrl: validatedArgs.baseUrl,
      });

      // ベースURLを指定してクライアントを作成
      const client = createVoicevoxClient({
        baseUrl: validatedArgs.baseUrl || "http://localhost:50021",
      });

      display.info(t("commands.core.versions.fetching"));

      // APIクライアントを使用してcore_versionsエンドポイントにアクセス
      // @ts-expect-error - API型定義にcore_versionsエンドポイントが含まれていないため
      const response = await client.GET("/core_versions", {});

      log.debug("API response received", {
        hasData: !!response.data,
        status: response.response?.status,
      });

      if (!response.data) {
        throw new VoicevoxError(
          "Invalid response format from core versions API",
          ErrorType.API,
          undefined,
          { baseUrl: validatedArgs.baseUrl },
        );
      }

      // JSON形式で出力する場合
      if (validatedArgs.json) {
        const output = JSON.stringify(response.data, null, 2);
        display.info(output);
        return;
      }

      // プレーンテキスト形式で出力
      display.info(t("commands.core.versions.versionsFound"));

      if (Array.isArray(response.data)) {
        response.data.forEach((version: unknown, index: number) => {
          display.info(`${index + 1}. ${String(version)}`);
        });
      } else {
        display.info(String(response.data));
      }

      log.debug("Core versions command completed successfully", {
        versionsCount: Array.isArray(response.data) ? response.data.length : 1,
      });
    } catch (error) {
      handleError(error, "core-versions", {
        baseUrl: args.baseUrl,
      });
    }
  },
});
