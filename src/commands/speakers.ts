import { defineCommand } from "citty";
import i18next from "@/i18n/config.js";
import { display, log } from "@/logger.js";
import { createClient, validateResponse } from "@/utils/api-helpers.js";
import { commonCommandOptions } from "@/utils/command-helpers.js";
import { createTable } from "@/utils/display.js";
import { handleError } from "@/utils/error-handler.js";
import { outputConditional } from "@/utils/output.js";

/**
 * 話者一覧コマンド
 *
 * VOICEVOX Engineから利用可能な話者一覧を取得し、表示する。
 * 話者名、UUID、スタイル情報をテーブル形式で表示する。
 *
 * @example
 * ```bash
 * # 話者一覧を表示
 * voicevox speakers
 *
 * # JSON形式で出力
 * voicevox speakers --json
 *
 * # 別のエンジンから取得
 * voicevox speakers --baseUrl http://localhost:8080
 * ```
 */
export const speakersCommand = defineCommand({
  meta: {
    name: i18next.t("commands.speakers.name"),
    description: i18next.t("commands.speakers.description"),
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
        i18next.t("commands.speakers.invalidResponse"),
        { baseUrl: args.baseUrl },
      );

      log.debug("API response received", {
        dataLength: Array.isArray(speakers) ? speakers.length : 0,
      });

      if (!Array.isArray(speakers)) {
        throw new Error(i18next.t("commands.speakers.invalidResponse"));
      }

      // 出力処理
      outputConditional(args.json || false, speakers, () => {
        // テーブル形式の出力を構築
        const headers = [
          i18next.t("commands.speakers.tableHeaders.name"),
          i18next.t("commands.speakers.tableHeaders.uuid"),
          i18next.t("commands.speakers.tableHeaders.styleName"),
          i18next.t("commands.speakers.tableHeaders.styleId"),
        ];
        const columnWidths = [20, 40, 20, 10];

        const rows: string[][] = speakers.flatMap((speaker: unknown) => {
          const speakerData = speaker as Record<string, unknown>;
          log.debug("Processing speaker", {
            name: speakerData["name"],
            uuid: speakerData["speaker_uuid"],
            stylesCount: Array.isArray(speakerData["styles"])
              ? speakerData["styles"].length
              : 0,
          });

          if (speakerData["styles"] && Array.isArray(speakerData["styles"])) {
            return speakerData["styles"].map((style: unknown) => {
              const styleData = style as Record<string, unknown>;
              return [
                String(speakerData["name"]),
                String(speakerData["speaker_uuid"]),
                String(styleData["name"]),
                String(styleData["id"]),
              ];
            });
          }
          // スタイルがない場合
          return [
            [
              String(speakerData["name"]),
              String(speakerData["speaker_uuid"]),
              "-",
              "-",
            ],
          ];
        });

        // テーブル形式の出力を生成
        const tableOutput = createTable(headers, rows, columnWidths);
        const fullOutput = `${i18next.t("commands.speakers.fetching")}\n\n${tableOutput}\n${i18next.t("commands.speakers.totalSpeakers", { count: speakers.length })}\n`;

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
