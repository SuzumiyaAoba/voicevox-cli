import { defineCommand } from "citty";
import { t } from "@/i18n/config.js";
import { display, log } from "@/logger.js";
import { createVoicevoxClient } from "@/utils/client.js";
import { commonCommandOptions } from "@/utils/command-helpers.js";
import {
  ErrorType,
  handleError,
  VoicevoxError,
} from "@/utils/error-handler.js";
import { validateArgs } from "@/utils/validation.js";
import { presetsAddSchema } from "./schemas.js";

// プリセット追加コマンド
export const presetsAddCommand = defineCommand({
  meta: {
    name: t("commands.presets.add.name"),
    description: t("commands.presets.add.description"),
  },
  args: {
    id: {
      type: "string",
      description: t("commands.presets.add.args.id"),
      required: true,
    },
    name: {
      type: "string",
      description: t("commands.presets.add.args.name"),
      required: true,
    },
    speaker: {
      type: "string",
      description: t("commands.presets.add.args.speaker"),
      alias: "s",
      required: true,
    },
    style: {
      type: "string",
      description: t("commands.presets.add.args.style"),
      required: true,
    },
    speed: {
      type: "string",
      description: t("commands.presets.add.args.speed"),
      required: true,
    },
    pitch: {
      type: "string",
      description: t("commands.presets.add.args.pitch"),
      required: true,
    },
    intonation: {
      type: "string",
      description: t("commands.presets.add.args.intonation"),
      required: true,
    },
    volume: {
      type: "string",
      description: t("commands.presets.add.args.volume"),
      required: true,
    },
    prePhonemeLength: {
      type: "string",
      description: t("commands.presets.add.args.prePhonemeLength"),
      required: true,
    },
    postPhonemeLength: {
      type: "string",
      description: t("commands.presets.add.args.postPhonemeLength"),
      required: true,
    },
    ...commonCommandOptions,
  },
  async run({ args }) {
    try {
      // 引数のバリデーション
      const validatedArgs = validateArgs(presetsAddSchema, args);

      log.debug("Starting presets add command", {
        id: validatedArgs.id,
        name: validatedArgs.name,
        baseUrl: validatedArgs.baseUrl,
      });

      // ベースURLを指定してクライアントを作成
      const client = createVoicevoxClient({ baseUrl: validatedArgs.baseUrl });

      // プリセットデータを構築（必須パラメータ）
      const presetData = {
        id: validatedArgs.id,
        name: validatedArgs.name,
        speaker_uuid: validatedArgs.speaker,
        style_id: validatedArgs.style,
        speedScale: validatedArgs.speed,
        pitchScale: validatedArgs.pitch,
        intonationScale: validatedArgs.intonation,
        volumeScale: validatedArgs.volume,
        prePhonemeLength: validatedArgs.prePhonemeLength,
        postPhonemeLength: validatedArgs.postPhonemeLength,
        pauseLengthScale: 1.0, // デフォルト値
      };

      log.debug("Making add preset API request", {
        baseUrl: validatedArgs.baseUrl,
        presetData,
      });

      display.info(
        t("commands.presets.add.adding", { name: validatedArgs.name }),
      );

      // APIクライアントを使用してadd_presetエンドポイントにアクセス
      const response = await client.POST("/add_preset", {
        body: presetData,
      });

      log.debug("API response received", {
        hasData: !!response.data,
      });

      if (!response.data) {
        throw new VoicevoxError(
          "Invalid response format from add preset API",
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
        t("commands.presets.add.added", { name: validatedArgs.name }),
      );
      display.info(
        t("commands.presets.add.presetId", { id: validatedArgs.id }),
      );

      log.debug("Presets add command completed successfully", {
        presetId: validatedArgs.id,
        presetName: validatedArgs.name,
      });
    } catch (error) {
      handleError(error, "presets-add", {
        id: args.id,
        name: args.name,
        baseUrl: args.baseUrl,
      });
    }
  },
});
