import { defineCommand } from "citty";
import { z } from "zod";
import { t } from "@/i18n/config.js";
import { display, log } from "@/logger.js";
import { createVoicevoxClient } from "@/utils/client.js";
import { commonCommandOptions } from "@/utils/command-helpers.js";
import {
  ErrorType,
  handleError,
  VoicevoxError,
} from "@/utils/error-handler.js";

// プリセット一覧コマンド
export const presetsListCommand = defineCommand({
  meta: {
    name: t("commands.presets.list.name"),
    description: t("commands.presets.list.description"),
  },
  args: {
    ...commonCommandOptions,
  },
  async run({ args }) {
    try {
      log.debug("Starting presets list command", { baseUrl: args.baseUrl });

      // ベースURLを指定してクライアントを作成
      const client = createVoicevoxClient({ baseUrl: args.baseUrl });

      log.debug("Making API request", { baseUrl: args.baseUrl });

      // APIクライアントを使用してpresetsエンドポイントにアクセス
      const response = await client.GET("/presets");

      log.debug("API response received", {
        hasData: !!response.data,
      });

      if (!response.data) {
        throw new VoicevoxError(
          "Invalid response format from presets API",
          ErrorType.API,
          undefined,
          { baseUrl: args.baseUrl },
        );
      }

      // Zodでレスポンスを検証し、以降は型安全に扱う
      const presetSchema = z.object({
        id: z.union([z.number(), z.string()]).optional(),
        name: z.string().optional(),
        speaker_uuid: z.string().optional(),
        style_id: z.number().optional(),
        speedScale: z.number().optional(),
        pitchScale: z.number().optional(),
        intonationScale: z.number().optional(),
        volumeScale: z.number().optional(),
        prePhonemeLength: z.number().optional(),
        postPhonemeLength: z.number().optional(),
      });
      const presetsSchema = z.array(presetSchema);
      const parsed = presetsSchema.safeParse(response.data);
      if (!parsed.success) {
        throw new VoicevoxError(
          "Invalid response format from presets API",
          ErrorType.API,
          undefined,
          { baseUrl: args.baseUrl },
        );
      }
      const presets = parsed.data;

      // JSON形式で出力する場合
      if (args.json) {
        const output = JSON.stringify(presets, null, 2);
        display.info(output);
        return;
      }

      // プレーンテキスト形式で出力
      display.info(t("commands.presets.list.fetching"));

      if (presets.length > 0) {
        display.info(
          t("commands.presets.list.totalPresets", {
            count: presets.length,
          }),
        );

        presets.forEach((preset, index) => {
          display.info(
            `${index + 1}. ${preset.name || t("commands.presets.list.defaultName", { index: index + 1 })}`,
          );
          if (preset.id !== undefined) {
            display.info(
              `   ${t("commands.presets.list.labels.id")}: ${preset.id}`,
            );
          }
          if (preset.speaker_uuid) {
            display.info(
              `   ${t("commands.presets.list.labels.speakerUuid")}: ${preset.speaker_uuid}`,
            );
          }
          if (preset.style_id !== undefined) {
            display.info(
              `   ${t("commands.presets.list.labels.styleId")}: ${preset.style_id}`,
            );
          }
          if (preset.speedScale !== undefined) {
            display.info(
              `   ${t("commands.presets.list.labels.speed")}: ${preset.speedScale}`,
            );
          }
          if (preset.pitchScale !== undefined) {
            display.info(
              `   ${t("commands.presets.list.labels.pitch")}: ${preset.pitchScale}`,
            );
          }
          if (preset.intonationScale !== undefined) {
            display.info(
              `   ${t("commands.presets.list.labels.intonation")}: ${preset.intonationScale}`,
            );
          }
          if (preset.volumeScale !== undefined) {
            display.info(
              `   ${t("commands.presets.list.labels.volume")}: ${preset.volumeScale}`,
            );
          }
          if (preset.prePhonemeLength !== undefined) {
            display.info(
              `   ${t("commands.presets.list.labels.prePhonemeLength")}: ${preset.prePhonemeLength}`,
            );
          }
          if (preset.postPhonemeLength !== undefined) {
            display.info(
              `   ${t("commands.presets.list.labels.postPhonemeLength")}: ${preset.postPhonemeLength}`,
            );
          }
          display.info(""); // 空行を追加
        });
      } else {
        display.info(t("commands.presets.list.noPresets"));
      }

      log.debug("Presets list command completed successfully");
    } catch (error) {
      handleError(error, "presets-list", {
        baseUrl: args.baseUrl,
        json: args.json,
      });
    }
  },
});
