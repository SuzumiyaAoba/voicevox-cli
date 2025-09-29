import { defineCommand } from "citty";
import { t } from "@/i18n/index.js";
import { display, log } from "@/logger.js";
import { createClient, validateResponse } from "@/utils/api-helpers.js";
import { commonCommandOptions } from "@/utils/command-helpers.js";
import { createTable } from "@/utils/display.js";
import { handleError } from "@/utils/error-handler.js";
import { outputConditional } from "@/utils/output.js";

// 話者一覧コマンド
export const speakersCommand = defineCommand({
  meta: {
    name: t("commands.speakers.name"),
    description: t("commands.speakers.description"),
  },
  args: commonCommandOptions,
  async run({ args }) {
    try {
      log.debug("Starting speakers command", { baseUrl: args.baseUrl });

      const client = createClient(args.baseUrl);

      log.debug("Making API request", { baseUrl: args.baseUrl });

      const response = await client.GET("/speakers");
      const speakers = validateResponse(
        response,
        "Invalid response format from speakers API",
        { baseUrl: args.baseUrl },
      );

      log.debug("API response received", {
        dataLength: Array.isArray(speakers) ? speakers.length : 0,
      });

      if (!Array.isArray(speakers)) {
        throw new Error("Expected speakers to be an array");
      }

      // 出力処理
      outputConditional(args.json || false, speakers, () => {
        // テーブル形式の出力を構築
        const headers = ["名前", "UUID", "Style名", "StyleID"];
        const columnWidths = [20, 40, 20, 10];

        const rows: string[][] = speakers.flatMap((speaker) => {
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
          }
          // スタイルがない場合
          return [[speaker.name, speaker.speaker_uuid, "-", "-"]];
        });

        // テーブル形式の出力を生成
        const tableOutput = createTable(headers, rows, columnWidths);
        const fullOutput = `${t("commands.speakers.fetching")}\n\n${tableOutput}\n${t("commands.speakers.totalSpeakers", { count: speakers.length })}\n`;

        // 直接出力
        display.info(fullOutput);
      });

      log.debug("Speakers command completed successfully");
    } catch (error) {
      handleError(error, "speakers", {
        baseUrl: args.baseUrl,
        json: args.json,
      });
    }
  },
});
