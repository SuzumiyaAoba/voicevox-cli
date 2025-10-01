import type { paths } from "@suzumiyaaoba/voicevox-client";
import { defineCommand } from "citty";
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
  return {
    id: validatedArgs.id,
    ...(validatedArgs.name !== undefined ? { name: validatedArgs.name } : {}),
    ...(validatedArgs.speaker !== undefined
      ? { speaker_uuid: validatedArgs.speaker }
      : {}),
    ...(validatedArgs.style !== undefined
      ? { style_id: validatedArgs.style }
      : {}),
    ...(validatedArgs.speed !== undefined
      ? { speedScale: validatedArgs.speed }
      : {}),
    ...(validatedArgs.pitch !== undefined
      ? { pitchScale: validatedArgs.pitch }
      : {}),
    ...(validatedArgs.intonation !== undefined
      ? { intonationScale: validatedArgs.intonation }
      : {}),
    ...(validatedArgs.volume !== undefined
      ? { volumeScale: validatedArgs.volume }
      : {}),
    ...(validatedArgs.prePhonemeLength !== undefined
      ? { prePhonemeLength: validatedArgs.prePhonemeLength }
      : {}),
    ...(validatedArgs.postPhonemeLength !== undefined
      ? { postPhonemeLength: validatedArgs.postPhonemeLength }
      : {}),
  };
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
