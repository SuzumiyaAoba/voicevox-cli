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
import { validateArgs } from "@/utils/validation.js";
import { presetsDeleteSchema } from "./schemas.js";

// プリセット削除コマンド
export const presetsDeleteCommand = defineCommand({
  meta: {
    name: i18next.t("commands.presets.delete.name"),
    description: i18next.t("commands.presets.delete.description"),
  },
  args: {
    id: {
      type: "string",
      description: i18next.t("commands.presets.delete.args.id"),
      required: true,
    },
    ...commonCommandOptions,
  },
  async run({ args }) {
    try {
      // 引数のバリデーション
      const validatedArgs = validateArgs(presetsDeleteSchema, args);

      log.debug("Starting presets delete command", {
        id: validatedArgs.id,
        baseUrl: validatedArgs.baseUrl,
      });

      // ベースURLを指定してクライアントを作成
      const client = createVoicevoxClient({ baseUrl: validatedArgs.baseUrl });

      // 削除するプリセットのID
      const presetId = validatedArgs.id;

      log.debug("Making delete preset API request", {
        baseUrl: validatedArgs.baseUrl,
        presetId,
      });

      display.info(
        i18next.t("commands.presets.delete.deleting", { id: presetId }),
      );

      // APIクライアントを使用してdelete_presetエンドポイントにアクセス
      const response = await client.DELETE(
        "/delete_preset" as "/user_dict_word/{word_uuid}",
        {
          params: {
            path: {
              word_uuid: String(presetId),
            },
          },
        },
      );

      log.debug("API response received", {
        hasData: !!response.data,
        status: response.response?.status,
      });

      if (!response.data) {
        throw new VoicevoxError(
          "Invalid response format from delete preset API",
          ErrorType.API,
          undefined,
          { baseUrl: validatedArgs.baseUrl, presetId },
        );
      }

      // JSON形式で出力する場合
      if (validatedArgs.json) {
        const result = {
          success: true,
          deleted: true,
          presetId: presetId,
          message: i18next.t("commands.presets.delete.deleted", {
            id: presetId,
          }),
        };
        const output = JSON.stringify(result, null, 2);
        display.info(output);
        return;
      }

      // プレーンテキスト形式で出力
      display.info(
        i18next.t("commands.presets.delete.deleted", { id: presetId }),
      );

      log.debug("Presets delete command completed successfully", {
        presetId,
      });
    } catch (error) {
      handleError(error, "presets-delete", {
        id: args.id,
        baseUrl: args.baseUrl,
      });
    }
  },
});
