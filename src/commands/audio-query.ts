import { writeFileSync } from "node:fs";
import { defineCommand } from "citty";
import { t } from "@/i18n/index.js";
import { display, log } from "@/logger.js";
import { baseUrlOption } from "@/options.js";
import { createVoicevoxClient } from "@/utils/client.js";

// 音声クエリコマンド
export const audioQueryCommand = defineCommand({
  meta: {
    name: t("commands.audioQuery.name"),
    description: t("commands.audioQuery.description"),
  },
  args: {
    text: {
      type: "positional",
      description: t("commands.audioQuery.args.text"),
      required: true,
    },
    speaker: {
      type: "string",
      description: t("commands.audioQuery.args.speaker"),
      alias: "s",
      default: "2",
    },
    output: {
      type: "string",
      description: t("commands.audioQuery.args.output"),
      alias: "o",
    },
    "enable-katakana-english": {
      type: "boolean",
      description: t("commands.audioQuery.args.enableKatakanaEnglish"),
    },
    ...baseUrlOption,
  },
  async run({ args }) {
    log.debug("Starting audio-query command", {
      text: args.text,
      speaker: args.speaker,
      output: args.output,
      enableKatakanaEnglish: args["enable-katakana-english"],
      baseUrl: args.baseUrl,
    });

    display.info(t("commands.audioQuery.querying", { text: args.text }));
    display.info(t("commands.audioQuery.speakerId", { speaker: args.speaker }));

    try {
      log.debug("Making audio query API request", {
        baseUrl: args.baseUrl,
        speaker: args.speaker,
        text: args.text,
      });

      const speakerId = Number(args.speaker);
      const client = createVoicevoxClient({ baseUrl: args.baseUrl });

      // 音声クエリを生成
      const audioQueryRes = await client.POST("/audio_query", {
        params: {
          query: {
            speaker: speakerId,
            text: args.text,
            enable_kana_conversion: args["enable-katakana-english"] || false,
          },
        },
      });

      if (!audioQueryRes.data) {
        display.error(t("commands.audioQuery.queryError"));
        process.exit(1);
      }

      const audioQuery = audioQueryRes.data;

      // 出力ファイル名を決定
      const outputFile = args.output || "output/audio_query.json";

      // JSONデータをファイルに保存
      writeFileSync(outputFile, JSON.stringify(audioQuery, null, 2));

      display.info(
        t("commands.audioQuery.queryComplete", { output: outputFile }),
      );

      // コンソールにも出力（ファイル出力が指定されていない場合）
      if (!args.output) {
        display.info(t("commands.audioQuery.queryResult"));
        console.log(JSON.stringify(audioQuery, null, 2));
      }

      log.debug("Audio query command completed successfully", {
        outputFile,
        queryKeys: Object.keys(audioQuery),
      });
    } catch (error) {
      log.error("Error in audio-query command", {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      display.error(t("commands.audioQuery.queryError"));
      if (error instanceof Error) {
        display.error(`  ${error.message}`);
        if (error.message.includes("fetch")) {
          display.error(t("commands.audioQuery.makeSureEngineRunning"));
        }
      } else {
        display.error(`  ${t("common.unknown")}`);
      }
      process.exit(1);
    }
  },
});
