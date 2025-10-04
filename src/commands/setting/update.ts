import { defineCommand } from "citty";
import i18next from "@/i18n/config.js";
import { display, log } from "@/logger.js";
import { createClient, validateResponse } from "@/utils/api-helpers.js";
import { commonCommandOptions } from "@/utils/command-helpers.js";
import { handleError } from "@/utils/error-handler.js";
import { outputConditional } from "@/utils/output.js";

// 設定更新コマンド
export const settingUpdateCommand = defineCommand({
  meta: {
    name: i18next.t("commands.setting.update.name"),
    description: i18next.t("commands.setting.update.description"),
  },
  args: {
    corsPolicyMode: {
      type: "string",
      description: i18next.t("commands.setting.update.args.corsPolicyMode"),
      required: true,
    },
    allowOrigin: {
      type: "string",
      description: i18next.t("commands.setting.update.args.allowOrigin"),
    },
    ...commonCommandOptions,
  },
  async run({ args }) {
    try {
      log.debug("Starting setting update command", {
        baseUrl: args.baseUrl,
        corsPolicyMode: args.corsPolicyMode,
        allowOrigin: args.allowOrigin,
      });

      const client = createClient(args.baseUrl);

      log.debug("Making API request", {
        baseUrl: args.baseUrl,
        corsPolicyMode: args.corsPolicyMode,
        allowOrigin: args.allowOrigin,
      });

      const response = await client.POST("/setting", {
        body: {
          cors_policy_mode: args.corsPolicyMode as "all" | "localapps",
          allow_origin: args.allowOrigin,
        },
      });

      // 204 No Contentは成功レスポンス
      if (response.response.status !== 204) {
        validateResponse(
          response,
          i18next.t("commands.setting.update.errorUpdating"),
          {
            baseUrl: args.baseUrl,
          },
        );
      }

      log.debug("API response received", {
        status: response.response.status,
      });

      // 出力処理
      outputConditional(
        args.json || false,
        {
          success: true,
          corsPolicyMode: args.corsPolicyMode,
          allowOrigin: args.allowOrigin,
        },
        () => {
          // 設定更新完了メッセージを表示
          const updateInfo = `${i18next.t("commands.setting.update.success")}

${i18next.t("commands.setting.update.updatedSettings")}:
${i18next.t("commands.setting.update.corsPolicyMode")}: ${args.corsPolicyMode}${
            args.allowOrigin
              ? `
${i18next.t("commands.setting.update.allowOrigin")}: ${args.allowOrigin}`
              : ""
          }`;

          display.info(updateInfo);
        },
      );

      log.debug("Setting update command completed successfully");
    } catch (error) {
      handleError(error, "setting update", {
        baseUrl: args.baseUrl,
        json: args.json,
      });
    }
  },
});
