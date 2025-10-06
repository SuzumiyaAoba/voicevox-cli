import { defineCommand } from "citty";
import { z } from "zod";
import { t } from "@/i18n/config.js";
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
        t("commands.speakers.invalidResponse"),
        { baseUrl: args.baseUrl },
      );

      log.debug("API response received", {
        dataLength: Array.isArray(speakers) ? speakers.length : 0,
      });

      // OpenAPI の `Speaker` 構造に準拠することを Zod で検証
      const styleSchema = z.object({
        name: z.string(),
        id: z.number(),
      });
      const speakerSchema = z.object({
        name: z.string(),
        speaker_uuid: z.string(),
        styles: z.array(styleSchema).optional().default([]),
      });
      const speakersSchema = z.array(speakerSchema);
      const parsed = speakersSchema.safeParse(speakers);
      if (!parsed.success) {
        throw new Error(t("commands.speakers.invalidResponse"));
      }
      const safeSpeakers: Array<z.infer<typeof speakerSchema>> = parsed.data;

      // 出力処理
      outputConditional(args.json || false, safeSpeakers, () => {
        // テーブル形式の出力を構築
        const headers = [
          t("commands.speakers.tableHeaders.name"),
          t("commands.speakers.tableHeaders.uuid"),
          t("commands.speakers.tableHeaders.styleName"),
          t("commands.speakers.tableHeaders.styleId"),
        ];
        const columnWidths = [20, 40, 20, 10];

        const rows: string[][] = safeSpeakers.flatMap((speaker) => {
          log.debug("Processing speaker", {
            name: speaker.name,
            uuid: speaker.speaker_uuid,
            stylesCount: speaker.styles.length,
          });

          if (speaker.styles.length > 0) {
            return speaker.styles.map((style) => [
              speaker.name,
              speaker.speaker_uuid,
              style.name,
              String(style.id),
            ]);
          }
          // スタイルがない場合
          return [[speaker.name, speaker.speaker_uuid, "-", "-"]];
        });

        // テーブル形式の出力を生成
        const tableOutput = createTable(headers, rows, columnWidths);
        const fullOutput = `${t("commands.speakers.fetching")}\n\n${tableOutput}\n${t("commands.speakers.totalSpeakers", { count: safeSpeakers.length })}\n`;

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
