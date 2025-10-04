import { defineCommand } from "citty";
import { t } from "@/i18n/index.js";
import { display, log } from "@/logger.js";
import { createClient, validateResponse } from "@/utils/api-helpers.js";
import { commonCommandOptions } from "@/utils/command-helpers.js";
import { handleError } from "@/utils/error-handler.js";
import { outputConditional } from "@/utils/output.js";

// 設定情報コマンド
export const settingCommand = defineCommand({
  meta: {
    name: t("commands.setting.name"),
    description: t("commands.setting.description"),
  },
  args: commonCommandOptions,
  async run({ args }) {
    try {
      log.debug("Starting setting command", { baseUrl: args.baseUrl });

      const client = createClient(args.baseUrl);

      log.debug("Making API request", { baseUrl: args.baseUrl });

      const response = await client.GET("/setting");
      const setting = validateResponse(
        response,
        t("commands.setting.errorFetching"),
        { baseUrl: args.baseUrl },
      );

      log.debug("API response received", {
        dataType: typeof setting,
      });

      // 出力処理
      outputConditional(args.json || false, setting, () => {
        // 設定情報を整形して表示
        const settingInfo = `${t("commands.setting.fetching")}

${t("commands.setting.settingInfo")}:
URL: ${args.baseUrl}
${t("commands.setting.settingData")}: ${JSON.stringify(setting, null, 2)}`;

        display.info(settingInfo);
      });

      log.debug("Setting command completed successfully");
    } catch (error) {
      handleError(error, "setting", {
        baseUrl: args.baseUrl,
        json: args.json,
      });
    }
  },
});
