import { defineCommand } from "citty";
import { t } from "@/i18n/index.js";
import { display, log } from "@/logger.js";
import { createClient, validateResponse } from "@/utils/api-helpers.js";
import { commonCommandOptions } from "@/utils/command-helpers.js";
import { handleError } from "@/utils/error-handler.js";
import { outputConditional } from "@/utils/output.js";
import { engineVersionsSchema, validateArgs } from "@/utils/validation.js";

// コアバージョン一覧コマンド
export const coreVersionsCommand = defineCommand({
  meta: {
    name: t("commands.core.versions.name"),
    description: t("commands.core.versions.description"),
  },
  args: commonCommandOptions,
  async run({ args }) {
    try {
      // 引数のバリデーション
      const validatedArgs = validateArgs(engineVersionsSchema, args);

      log.debug("Starting core versions command", {
        baseUrl: validatedArgs.baseUrl,
      });

      const client = createClient(validatedArgs.baseUrl);

      display.info(t("commands.core.versions.fetching"));

      const response = await client.GET("/core_versions");
      const versions = validateResponse(
        response,
        "Invalid response format from core versions API",
        { baseUrl: validatedArgs.baseUrl },
      );

      log.debug("API response received", {
        hasData: !!versions,
        status: response.response?.status,
      });

      // 出力処理
      outputConditional(validatedArgs.json || false, versions, () => {
        display.info(t("commands.core.versions.versionsFound"));

        if (Array.isArray(versions)) {
          versions.forEach((version: unknown, index: number) => {
            display.info(`${index + 1}. ${String(version)}`);
          });
        } else {
          display.info(String(versions));
        }
      });

      log.debug("Core versions command completed successfully", {
        versionsCount: Array.isArray(versions) ? versions.length : 1,
      });
    } catch (error) {
      handleError(error, "core-versions", {
        baseUrl: args.baseUrl,
      });
    }
  },
});
