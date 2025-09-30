import { defineCommand } from "citty";
import { t } from "@/i18n/index.js";
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

      // JSON形式で出力する場合
      if (args.json) {
        const output = JSON.stringify(response.data, null, 2);
        display.info(output);
        return;
      }

      // プレーンテキスト形式で出力
      display.info(t("commands.presets.list.fetching"));

      if (Array.isArray(response.data) && response.data.length > 0) {
        display.info(
          t("commands.presets.list.totalPresets", {
            count: response.data.length,
          }),
        );

        response.data.forEach((preset, index) => {
          display.info(`${index + 1}. ${preset.name || `Preset ${index + 1}`}`);
          if (preset.id) {
            display.info(`   ID: ${preset.id}`);
          }
          if (preset.speaker_uuid) {
            display.info(`   Speaker UUID: ${preset.speaker_uuid}`);
          }
          if (preset.style_id) {
            display.info(`   Style ID: ${preset.style_id}`);
          }
          if (preset.speedScale !== undefined) {
            display.info(`   Speed: ${preset.speedScale}`);
          }
          if (preset.pitchScale !== undefined) {
            display.info(`   Pitch: ${preset.pitchScale}`);
          }
          if (preset.intonationScale !== undefined) {
            display.info(`   Intonation: ${preset.intonationScale}`);
          }
          if (preset.volumeScale !== undefined) {
            display.info(`   Volume: ${preset.volumeScale}`);
          }
          if (preset.prePhonemeLength !== undefined) {
            display.info(`   Pre-phoneme Length: ${preset.prePhonemeLength}`);
          }
          if (preset.postPhonemeLength !== undefined) {
            display.info(`   Post-phoneme Length: ${preset.postPhonemeLength}`);
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
