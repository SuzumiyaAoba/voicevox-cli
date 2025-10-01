import type { paths } from "@suzumiyaaoba/voicevox-client";
import { defineCommand } from "citty";
// (no utility needed here)
import type { z } from "zod";
import { t } from "@/i18n/index.js";
import { display, log } from "@/logger.js";
import { validateResponse } from "@/utils/api-helpers.js";
import { createVoicevoxClient } from "@/utils/client.js";
import { commonCommandOptions } from "@/utils/command-helpers.js";
import { handleError } from "@/utils/error-handler.js";
import { presetsUpdateSchema, validateArgs } from "@/utils/validation.js";

type UpdatePresetJson =
  paths["/update_preset"]["post"]["requestBody"]["content"]["application/json"];

type PresetsUpdateArgs = z.infer<typeof presetsUpdateSchema>;

const buildUpdatePresetData = (
  validatedArgs: PresetsUpdateArgs,
): { id: string | number } & Partial<UpdatePresetJson> => {
  type UpdateBody = { id: string | number } & Partial<UpdatePresetJson>;
  const add = <V>(
    acc: UpdateBody,
    value: V | undefined,
    build: (v: V) => Partial<UpdatePresetJson>,
  ): UpdateBody => {
    if (value === undefined) return acc;
    return Object.assign({}, acc, build(value));
  };

  const base: UpdateBody = { id: validatedArgs.id };
  const withName = add(base, validatedArgs.name, (v) => ({ name: v }));
  const withSpeaker = add(withName, validatedArgs.speaker, (v) => ({
    speaker_uuid: v,
  }));
  const withStyle = add(withSpeaker, validatedArgs.style, (v) => ({
    style_id: v,
  }));
  const withSpeed = add(withStyle, validatedArgs.speed, (v) => ({
    speedScale: v,
  }));
  const withPitch = add(withSpeed, validatedArgs.pitch, (v) => ({
    pitchScale: v,
  }));
  const withIntonation = add(withPitch, validatedArgs.intonation, (v) => ({
    intonationScale: v,
  }));
  const withVolume = add(withIntonation, validatedArgs.volume, (v) => ({
    volumeScale: v,
  }));
  const withPre = add(withVolume, validatedArgs.prePhonemeLength, (v) => ({
    prePhonemeLength: v,
  }));
  const withPost = add(withPre, validatedArgs.postPhonemeLength, (v) => ({
    postPhonemeLength: v,
  }));
  return withPost;
};

const requestUpdatePreset = async (
  client: ReturnType<typeof createVoicevoxClient>,
  body: UpdatePresetJson,
) => {
  const response = await client.POST("/update_preset", { body });
  return validateResponse(
    response,
    "Invalid response format from update preset API",
  );
};

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
    ...commonCommandOptions,
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
      const presetData = buildUpdatePresetData(validatedArgs);

      log.debug("Making update preset API request", {
        baseUrl: validatedArgs.baseUrl,
        presetData,
      });

      display.info(
        t("commands.presets.update.updating", { id: validatedArgs.id }),
      );

      // APIクライアントを使用してupdate_presetエンドポイントにアクセス
      const responseData = await requestUpdatePreset(
        client,
        presetData as UpdatePresetJson,
      );

      log.debug("API response received", { hasData: !!responseData });

      // JSON形式で出力する場合
      if (validatedArgs.json) {
        const output = JSON.stringify(responseData, null, 2);
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
