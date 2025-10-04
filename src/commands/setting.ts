import { defineCommand } from "citty";
import { t } from "@/i18n/index.js";
import { display, log } from "@/logger.js";
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

      // 出力処理
      outputConditional(
        args.json || false,
        { url: `${args.baseUrl}/setting` },
        () => {
          // 設定URLを表示
          const settingInfo = `${t("commands.setting.settingInfo")}:
URL: ${args.baseUrl}/setting`;

          display.info(settingInfo);
        },
      );

      log.debug("Setting command completed successfully");
    } catch (error) {
      handleError(error, "setting", {
        baseUrl: args.baseUrl,
        json: args.json,
      });
    }
  },
});
