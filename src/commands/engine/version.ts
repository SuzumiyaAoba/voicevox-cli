import { defineCommand } from "citty";
import { display, log } from "../../logger.js";
import { baseUrlOption } from "../../options.js";
import { createVoicevoxClient } from "../../utils/client.js";

// エンジンバージョン表示コマンド
export const engineVersionCommand = defineCommand({
  meta: {
    name: "engine-version",
    description: "Show VOICEVOX Engine version information",
  },
  args: {
    json: {
      type: "boolean",
      description: "Output in JSON format",
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
        display.error("Invalid response format");
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
      const output = `VOICEVOX Engine Version: ${versionInfo || "Unknown"}`;
      display.info(output);

      log.debug("Engine-version command completed successfully");
    } catch (error) {
      log.error("Error in engine-version command", {
        error: error instanceof Error ? error.message : String(error),
      });
      display.error("Error fetching engine version:");
      if (error instanceof Error) {
        display.error(`  ${error.message}`);
        if (error.message.includes("fetch")) {
          display.error(
            "  Make sure VOICEVOX Engine is running on the specified URL",
          );
        }
      } else {
        display.error("  Unknown error occurred");
      }
      process.exit(1);
    }
  },
});
