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
    json: {
      type: "boolean",
      description: t("commands.presets.add.args.json"),
      alias: "j",
    },
    ...baseUrlOption,
  },
  async run({ args }) {
    try {
      log.debug("Starting presets add command", {
        id: args.id,
        name: args.name,
        baseUrl: args.baseUrl,
      });

      // ベースURLを指定してクライアントを作成
      const client = createVoicevoxClient({ baseUrl: args.baseUrl });

      // プリセットデータを構築（必須パラメータ）
      const presetData = {
        id: Number(args.id),
        name: args.name,
        speaker_uuid: args.speaker,
        style_id: Number(args.style),
        speedScale: Number(args.speed),
        pitchScale: Number(args.pitch),
        intonationScale: Number(args.intonation),
        volumeScale: Number(args.volume),
        prePhonemeLength: Number(args.prePhonemeLength),
        postPhonemeLength: Number(args.postPhonemeLength),
        pauseLengthScale: 1.0, // デフォルト値
      };

      log.debug("Making add preset API request", {
        baseUrl: args.baseUrl,
        presetData,
      });

      display.info(t("commands.presets.add.adding", { name: args.name }));

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
          { baseUrl: args.baseUrl, presetData },
        );
      }

      // JSON形式で出力する場合
      if (args.json) {
        const output = JSON.stringify(response.data, null, 2);
        display.info(output);
        return;
      }

      // プレーンテキスト形式で出力
      display.info(t("commands.presets.add.added", { name: args.name }));
      display.info(t("commands.presets.add.presetId", { id: args.id }));

      log.debug("Presets add command completed successfully", {
        presetId: args.id,
        presetName: args.name,
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
