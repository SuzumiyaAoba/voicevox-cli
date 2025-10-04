import { defineCommand } from "citty";
import i18next from "@/i18n/config.js";
import { display, log } from "@/logger.js";
import { createVoicevoxClient } from "@/utils/client.js";
import { commonCommandOptions } from "@/utils/command-helpers.js";
import {
  ErrorType,
  handleError,
  VoicevoxError,
} from "@/utils/error-handler.js";

// エンジンバージョン表示コマンド
export const engineVersionCommand = defineCommand({
  meta: {
    name: i18next.t("commands.engine.version.name"),
    description: i18next.t("commands.engine.version.description"),
  },
  args: {
    ...commonCommandOptions,
  },
  async run({ args }) {
    try {
      log.debug("Starting engine-version command", { baseUrl: args.baseUrl });

      // ベースURLを指定してクライアントを作成
      const client = createVoicevoxClient({ baseUrl: args.baseUrl });

      log.debug("Making API request", { baseUrl: args.baseUrl });

      // APIクライアントを使用してversionエンドポイントにアクセス
      const response = await client.GET("/version");

      log.debug("API response received", {
        hasData: !!response.data,
      });

      if (!response.data) {
        throw new VoicevoxError(
          "Invalid response format from engine version API",
          ErrorType.API,
          undefined,
          { baseUrl: args.baseUrl },
        );
      }

      // JSON形式で出力する場合
      if (args.json) {
        const output = JSON.stringify(response.data, null, 2);
        display.info(output);
        return;
      }

      // プレーンテキスト形式で出力
      const versionInfo = response.data;
      const output = i18next.t("commands.engine.version.engineVersion", {
        version: versionInfo || i18next.t("common.unknown"),
      });
      display.info(output);

      log.debug("Engine-version command completed successfully");
    } catch (error) {
      handleError(error, "engine-version", {
        baseUrl: args.baseUrl,
        json: args.json,
      });
    }
  },
});
