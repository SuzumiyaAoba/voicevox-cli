import { defineCommand } from "citty";
import { t } from "@/i18n/index.js";
import { display, log } from "@/logger.js";
import { displayAudioQueryInfo } from "@/utils/audio-query-display.js";
import { createVoicevoxClient } from "@/utils/client.js";
import { commonCommandOptions } from "@/utils/command-helpers.js";
import {
  ErrorType,
  handleError,
  VoicevoxError,
} from "@/utils/error-handler.js";
import { audioQuerySchema, validateArgs } from "@/utils/validation.js";

// 音声クエリ作成コマンド
export const createCommand = defineCommand({
  meta: {
    name: t("commands.query.create.name"),
    description: t("commands.query.create.description"),
  },
  args: {
    text: {
      type: "positional",
      description: t("commands.query.create.args.text"),
      required: true,
    },
    speaker: {
      type: "string",
      description: t("commands.query.create.args.speaker"),
      alias: "s",
      default: "2",
    },
    "preset-id": {
      type: "string",
      description: t("commands.query.create.args.presetId"),
    },
    "enable-katakana-english": {
      type: "boolean",
      description: t("commands.query.create.args.enableKatakanaEnglish"),
    },
    ...commonCommandOptions,
  },
  async run({ args }) {
    // 引数のバリデーション
    const validatedArgs = validateArgs(audioQuerySchema, args);

    log.debug("Starting create command", {
      text: validatedArgs.text,
      speaker: validatedArgs.speaker,
      presetId: validatedArgs.presetId,
      baseUrl: validatedArgs.baseUrl,
    });

    display.info(
      t("commands.query.create.querying", { text: validatedArgs.text }),
    );
    if (validatedArgs.presetId !== undefined) {
      display.info(
        t("commands.query.create.usingPreset", {
          presetId: String(validatedArgs.presetId),
        }),
      );
    } else {
      display.info(
        t("commands.query.create.speakerId", {
          speaker: String(validatedArgs.speaker),
        }),
      );
    }

    try {
      log.debug("Making audio query API request", {
        baseUrl: validatedArgs.baseUrl,
        speaker: validatedArgs.speaker ?? null,
        presetId: validatedArgs.presetId ?? null,
        text: validatedArgs.text,
      });

      const client = createVoicevoxClient({ baseUrl: validatedArgs.baseUrl });
      const audioQueryRes =
        validatedArgs.presetId !== undefined
          ? await client.POST("/audio_query_from_preset", {
              params: {
                query: {
                  text: validatedArgs.text,
                  preset_id: Number(validatedArgs.presetId),
                  ...(validatedArgs.enableKatakanaEnglish !== undefined
                    ? {
                        enable_katakana_english:
                          validatedArgs.enableKatakanaEnglish as boolean,
                      }
                    : {}),
                },
              },
            })
          : await client.POST("/audio_query", {
              params: {
                query: {
                  speaker: Number(validatedArgs.speaker),
                  text: validatedArgs.text,
                },
              },
            });

      if (!audioQueryRes.data) {
        throw new VoicevoxError(
          "Audio query failed: empty response",
          ErrorType.API,
          undefined,
          {
            speaker: validatedArgs.speaker,
            presetId: validatedArgs.presetId,
            text: validatedArgs.text,
          },
        );
      }

      const audioQuery = audioQueryRes.data;

      display.info(t("commands.query.create.queryComplete"));

      // JSON形式で出力する場合
      if (validatedArgs.json) {
        const output = JSON.stringify(audioQuery, null, 2);
        display.info(output);
        return;
      }

      // 整形して表示（共通ユーティリティ）
      display.info(t("commands.query.create.queryResult"));
      displayAudioQueryInfo(audioQuery as never);

      log.debug("Create command completed successfully", {
        queryKeys: Object.keys(audioQuery),
      });
    } catch (error) {
      handleError(error, "create", {
        speaker: args.speaker,
        text: args.text,
        baseUrl: args.baseUrl,
      });
    }
  },
});
