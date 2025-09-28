import { defineCommand } from "citty";
import { t } from "@/i18n/index.js";
import { display, log } from "@/logger.js";
import { baseUrlOption } from "@/options.js";
import { createVoicevoxClient } from "@/utils/client.js";
import { createTable } from "@/utils/display.js";

// 話者一覧コマンド
export const speakersCommand = defineCommand({
  meta: {
    name: t("commands.speakers.name"),
    description: t("commands.speakers.description"),
  },
  args: {
    json: {
      type: "boolean",
      description: t("commands.speakers.args.json"),
      alias: "j",
    },
    ...baseUrlOption,
  },
  async run({ args }) {
    try {
      log.debug("Starting speakers command", { baseUrl: args.baseUrl });

      // ベースURLを指定してクライアントを作成
      const client = createVoicevoxClient({ baseUrl: args.baseUrl });

      log.debug("Making API request", { baseUrl: args.baseUrl });

      // APIクライアントを使用してspeakersエンドポイントにアクセス
      const response = await client.GET("/speakers");

      log.debug("API response received", {
        dataLength: Array.isArray(response.data) ? response.data.length : 0,
      });

      if (!response.data || !Array.isArray(response.data)) {
        display.error(t("commands.speakers.invalidResponse"));
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
      const fullOutput = `${t("commands.speakers.fetching")}\n\n${tableOutput}\n${t("commands.speakers.totalSpeakers", { count: response.data.length })}\n`;

      // 直接出力
      display.info(fullOutput);
      log.debug("Speakers command completed successfully");
    } catch (error) {
      log.error("Error in speakers command", {
        error: error instanceof Error ? error.message : String(error),
      });
      display.error(t("commands.speakers.errorFetching"));
      if (error instanceof Error) {
        display.error(`  ${error.message}`);
        if (error.message.includes("fetch")) {
          display.error(`  ${t("commands.speakers.makeSureEngineRunning")}`);
        }
      } else {
        display.error(`  ${t("common.unknown")}`);
      }
      process.exit(1);
    }
  },
});
