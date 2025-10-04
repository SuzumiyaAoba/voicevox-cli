import { defineCommand } from "citty";
import i18next from "@/i18n/config.js";
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
    name: i18next.t("commands.presets.list.name"),
    description: i18next.t("commands.presets.list.description"),
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
      display.info(i18next.t("commands.presets.list.fetching"));

      if (Array.isArray(response.data) && response.data.length > 0) {
        display.info(
          i18next.t("commands.presets.list.totalPresets", {
            count: response.data.length,
          }),
        );

        response.data.forEach((preset: unknown, index: number) => {
          const presetData = preset as Record<string, unknown>;
          display.info(
            `${index + 1}. ${presetData["name"] || i18next.t("commands.presets.list.defaultName", { index: index + 1 })}`,
          );
          if (presetData["id"]) {
            display.info(
              `   ${i18next.t("commands.presets.list.labels.id")}: ${presetData["id"]}`,
            );
          }
          if (presetData["speaker_uuid"]) {
            display.info(
              `   ${i18next.t("commands.presets.list.labels.speakerUuid")}: ${presetData["speaker_uuid"]}`,
            );
          }
          if (presetData["style_id"]) {
            display.info(
              `   ${i18next.t("commands.presets.list.labels.styleId")}: ${presetData["style_id"]}`,
            );
          }
          if (presetData["speedScale"] !== undefined) {
            display.info(
              `   ${i18next.t("commands.presets.list.labels.speed")}: ${presetData["speedScale"]}`,
            );
          }
          if (presetData["pitchScale"] !== undefined) {
            display.info(
              `   ${i18next.t("commands.presets.list.labels.pitch")}: ${presetData["pitchScale"]}`,
            );
          }
          if (presetData["intonationScale"] !== undefined) {
            display.info(
              `   ${i18next.t("commands.presets.list.labels.intonation")}: ${presetData["intonationScale"]}`,
            );
          }
          if (presetData["volumeScale"] !== undefined) {
            display.info(
              `   ${i18next.t("commands.presets.list.labels.volume")}: ${presetData["volumeScale"]}`,
            );
          }
          if (presetData["prePhonemeLength"] !== undefined) {
            display.info(
              `   ${i18next.t("commands.presets.list.labels.prePhonemeLength")}: ${presetData["prePhonemeLength"]}`,
            );
          }
          if (presetData["postPhonemeLength"] !== undefined) {
            display.info(
              `   ${i18next.t("commands.presets.list.labels.postPhonemeLength")}: ${presetData["postPhonemeLength"]}`,
            );
          }
          display.info(""); // 空行を追加
        });
      } else {
        display.info(i18next.t("commands.presets.list.noPresets"));
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
