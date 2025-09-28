import type { paths } from "@suzumiyaaoba/voicevox-client";
import { defineCommand } from "citty";
import openapiFetch from "openapi-fetch";
import { display, log } from "../logger.js";
import { baseUrlOption } from "../options.js";
import { createTable } from "../utils/display.js";

// 話者一覧コマンド
export const speakersCommand = defineCommand({
  meta: {
    name: "speakers",
    description: "List available speakers",
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
      log.debug("Starting speakers command", { baseUrl: args.baseUrl });

      // ベースURLを指定してクライアントを作成
      const client = openapiFetch<paths>({
        baseUrl: args.baseUrl,
      });

      log.debug("Making API request", { baseUrl: args.baseUrl });

      // APIクライアントを使用してspeakersエンドポイントにアクセス
      const response = await client.GET("/speakers");

      log.debug("API response received", {
        dataLength: Array.isArray(response.data) ? response.data.length : 0,
      });

      if (!response.data || !Array.isArray(response.data)) {
        display.error("Invalid response format");
        process.exit(1);
      }

      // JSON形式で出力する場合
      if (args.json) {
        const output = JSON.stringify(response.data, null, 2);
        display.info(output);
        return;
      }

      // テーブル形式の出力を構築
      const headers = ["名前", "UUID", "Style名", "StyleID"];
      const columnWidths = [20, 40, 20, 10];

      const rows: string[][] = response.data.flatMap((speaker) => {
        log.debug("Processing speaker", {
          name: speaker.name,
          uuid: speaker.speaker_uuid,
          stylesCount: speaker.styles?.length || 0,
        });

        if (speaker.styles && Array.isArray(speaker.styles)) {
          return speaker.styles.map((style) => [
            speaker.name,
            speaker.speaker_uuid,
            style.name,
            style.id.toString(),
          ]);
        } else {
          // スタイルがない場合
          return [[speaker.name, speaker.speaker_uuid, "-", "-"]];
        }
      });

      // テーブル形式の出力を生成
      const tableOutput = createTable(headers, rows, columnWidths);
      const fullOutput = `Fetching available speakers...\n\n${tableOutput}\nTotal ${response.data.length} speakers found\n`;

      // 直接出力
      display.info(fullOutput);
      log.debug("Speakers command completed successfully");
    } catch (error) {
      log.error("Error in speakers command", {
        error: error instanceof Error ? error.message : String(error),
      });
      display.error("Error fetching speakers:");
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
