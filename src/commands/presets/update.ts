import { defineCommand } from "citty";
import { t } from "@/i18n/index.js";
import { display, log } from "@/logger.js";
import { baseUrlOption } from "@/options.js";
import { createVoicevoxClient } from "@/utils/client.js";
import {
  ErrorType,
  handleError,
  VoicevoxError,
} from "@/utils/error-handler.js";
import { presetsUpdateSchema, validateArgs } from "@/utils/validation.js";

// プリセット更新コマンド
export const presetsUpdateCommand = defineCommand({
  meta: {
    name: t("commands.presets.update.name"),
    description: t("commands.presets.update.description"),
  },
  args: {
    id: {
      type: "string",
      description: t("commands.presets.update.args.id"),
      required: true,
    },
    name: {
      type: "string",
      description: t("commands.presets.update.args.name"),
    },
    speaker: {
      type: "string",
      description: t("commands.presets.update.args.speaker"),
      alias: "s",
    },
    style: {
      type: "string",
      description: t("commands.presets.update.args.style"),
    },
    speed: {
      type: "string",
      description: t("commands.presets.update.args.speed"),
    },
    pitch: {
      type: "string",
      description: t("commands.presets.update.args.pitch"),
    },
    intonation: {
      type: "string",
      description: t("commands.presets.update.args.intonation"),
    },
    volume: {
      type: "string",
      description: t("commands.presets.update.args.volume"),
    },
    prePhonemeLength: {
      type: "string",
      description: t("commands.presets.update.args.prePhonemeLength"),
    },
    postPhonemeLength: {
      type: "string",
      description: t("commands.presets.update.args.postPhonemeLength"),
    },
    json: {
      type: "boolean",
      description: t("commands.presets.update.args.json"),
      alias: "j",
    },
    ...baseUrlOption,
  },
  async run({ args }) {
    try {
      // 引数のバリデーション
      const validatedArgs = validateArgs(presetsUpdateSchema, args);

      log.debug("Starting presets update command", {
        id: validatedArgs.id,
        baseUrl: validatedArgs.baseUrl,
      });

      // ベースURLを指定してクライアントを作成
      const client = createVoicevoxClient({ baseUrl: validatedArgs.baseUrl });

      // 更新するフィールドのみを含むプリセットデータを構築
      const presetData: Record<string, unknown> = {
        id: validatedArgs.id,
      };

      // 提供されたフィールドのみを追加
      if (validatedArgs.name !== undefined) {
        presetData["name"] = validatedArgs.name;
      }
      if (validatedArgs.speaker !== undefined) {
        presetData["speaker_uuid"] = validatedArgs.speaker;
      }
      if (validatedArgs.style !== undefined) {
        presetData["style_id"] = validatedArgs.style;
      }
      if (validatedArgs.speed !== undefined) {
        presetData["speedScale"] = validatedArgs.speed;
      }
      if (validatedArgs.pitch !== undefined) {
        presetData["pitchScale"] = validatedArgs.pitch;
      }
      if (validatedArgs.intonation !== undefined) {
        presetData["intonationScale"] = validatedArgs.intonation;
      }
      if (validatedArgs.volume !== undefined) {
        presetData["volumeScale"] = validatedArgs.volume;
      }
      if (validatedArgs.prePhonemeLength !== undefined) {
        presetData["prePhonemeLength"] = validatedArgs.prePhonemeLength;
      }
      if (validatedArgs.postPhonemeLength !== undefined) {
        presetData["postPhonemeLength"] = validatedArgs.postPhonemeLength;
      }

      log.debug("Making update preset API request", {
        baseUrl: validatedArgs.baseUrl,
        presetData,
      });

      display.info(
        t("commands.presets.update.updating", { id: validatedArgs.id }),
      );

      // APIクライアントを使用してupdate_presetエンドポイントにアクセス
      const response = await client.POST("/update_preset", {
        // @ts-expect-error - API型定義が厳密すぎるため、部分更新データを許可
        body: presetData,
      });

      log.debug("API response received", {
        hasData: !!response.data,
      });

      if (!response.data) {
        throw new VoicevoxError(
          "Invalid response format from update preset API",
          ErrorType.API,
          undefined,
          { baseUrl: validatedArgs.baseUrl, presetData },
        );
      }

      // JSON形式で出力する場合
      if (validatedArgs.json) {
        const output = JSON.stringify(response.data, null, 2);
        display.info(output);
        return;
      }

      // プレーンテキスト形式で出力
      display.info(
        t("commands.presets.update.updated", { id: validatedArgs.id }),
      );

      log.debug("Presets update command completed successfully", {
        presetId: validatedArgs.id,
      });
    } catch (error) {
      handleError(error, "presets-update", {
        id: args.id,
        baseUrl: args.baseUrl,
      });
    }
  },
});
