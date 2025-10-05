import type { paths } from "@suzumiyaaoba/voicevox-client";
import { defineCommand } from "citty";
import { produce } from "immer";
// (no utility needed here)
import { t } from "@/i18n/config.js";
import { display, log } from "@/logger.js";
import { validateResponse } from "@/utils/api-helpers.js";
import { createVoicevoxClient } from "@/utils/client.js";
import { commonCommandOptions } from "@/utils/command-helpers.js";
import { handleError } from "@/utils/error-handler.js";
import { validateArgs } from "@/utils/validation.js";
import { type PresetsUpdateArgs, presetsUpdateSchema } from "./schemas.js";

type UpdatePresetJson =
  paths["/update_preset"]["post"]["requestBody"]["content"]["application/json"];

// Using exported inferred type from validation.ts

type UpdateBody = { id: string | number } & Partial<UpdatePresetJson>;

const buildUpdatePresetData = (
  validatedArgs: PresetsUpdateArgs,
): UpdateBody => {
  return produce<UpdateBody>({ id: validatedArgs.id }, (draft) => {
    draft.name = validatedArgs.name;
    draft.speaker_uuid = validatedArgs.speaker;
    draft.style_id = validatedArgs.style;
    draft.speedScale = validatedArgs.speed;
    draft.pitchScale = validatedArgs.pitch;
    draft.intonationScale = validatedArgs.intonation;
    draft.volumeScale = validatedArgs.volume;
    draft.prePhonemeLength = validatedArgs.prePhonemeLength;
    draft.postPhonemeLength = validatedArgs.postPhonemeLength;
  });
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
