import { defineCommand } from "citty";
import { t } from "@/i18n/index.js";
import { display, log } from "@/logger.js";
import { baseUrlOption } from "@/options.js";
import { createVoicevoxClient } from "@/utils/client.js";

// エンジンバージョン表示コマンド
export const engineVersionCommand = defineCommand({
  meta: {
    name: t("commands.engine.version.name"),
    description: t("commands.engine.version.description"),
  },
  args: {
    json: {
      type: "boolean",
      description: t("commands.engine.version.args.json"),
      alias: "j",
    },
    ...baseUrlOption,
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
        display.error(t("commands.engine.version.invalidResponse"));
        process.exit(1);
      }

      // JSON形式で出力する場合
      if (args.json) {
        const output = JSON.stringify(response.data, null, 2);
        display.info(output);
        return;
      }

      // プレーンテキスト形式で出力
      const versionInfo = response.data;
      const output = t("commands.engine.version.engineVersion", {
        version: versionInfo || t("common.unknown"),
      });
      display.info(output);

      log.debug("Engine-version command completed successfully");
    } catch (error) {
      log.error("Error in engine-version command", {
        error: error instanceof Error ? error.message : String(error),
      });
      display.error(t("commands.engine.version.errorFetching"));
      if (error instanceof Error) {
        display.error(`  ${error.message}`);
        if (error.message.includes("fetch")) {
          display.error(
            `  ${t("commands.engine.version.makeSureEngineRunning")}`,
          );
        }
      } else {
        display.error(`  ${t("commands.engine.version.unknownError")}`);
      }
      process.exit(1);
    }
  },
});
