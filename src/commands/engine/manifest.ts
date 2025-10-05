import { defineCommand } from "citty";
import { t } from "@/i18n/config.js";
import { display, log } from "@/logger.js";
import { createClient, validateResponse } from "@/utils/api-helpers.js";
import { commonCommandOptions } from "@/utils/command-helpers.js";
import { handleError } from "@/utils/error-handler.js";
import { outputConditional } from "@/utils/output.js";

// エンジンマニフェストコマンド
export const engineManifestCommand = defineCommand({
  meta: {
    name: t("commands.engine.manifest.name"),
    description: t("commands.engine.manifest.description"),
  },
  args: commonCommandOptions,
  async run({ args }) {
    try {
      log.debug("Starting engine manifest command", {
        baseUrl: args.baseUrl,
      });

      const client = createClient(args.baseUrl);

      log.debug("Making API request", {
        baseUrl: args.baseUrl,
      });

      const response = await client.GET("/engine_manifest");
      const manifest = validateResponse(
        response,
        t("commands.engine.manifest.errorFetching"),
        { baseUrl: args.baseUrl },
      );

      log.debug("API response received", {
        dataType: typeof manifest,
      });

      // 出力処理
      outputConditional(args.json || false, manifest, () => {
        // エンジンマニフェスト情報を整形して表示
        const labels = {
          fetching: t("commands.engine.manifest.fetching"),
          manifestInfo: t("commands.engine.manifest.manifestInfo"),
          engineName: t("commands.engine.manifest.engineName"),
          brandName: t("commands.engine.manifest.brandName"),
          version: t("commands.engine.manifest.version"),
          uuid: t("commands.engine.manifest.uuid"),
          url: t("commands.engine.manifest.url"),
          defaultSamplingRate: t(
            "commands.engine.manifest.defaultSamplingRate",
          ),
          frameRate: t("commands.engine.manifest.frameRate"),
          supportedFeatures: t("commands.engine.manifest.supportedFeatures"),
        };

        const manifestInfo = `${labels.fetching}

${labels.manifestInfo}:
${labels.engineName}: ${manifest.name}
${labels.brandName}: ${manifest.brand_name}
${labels.version}: ${manifest.manifest_version}
${labels.uuid}: ${manifest.uuid}
${labels.url}: ${manifest.url}
${labels.defaultSamplingRate}: ${manifest.default_sampling_rate}Hz
${labels.frameRate}: ${manifest.frame_rate}Hz

${labels.supportedFeatures}:
${Object.entries(manifest.supported_features)
  .map(([key, value]) => `  ${key}: ${value}`)
  .join("\n")}`;

        display.info(manifestInfo);
      });

      log.debug("Engine manifest command completed successfully");
    } catch (error) {
      handleError(error, "engine manifest", {
        baseUrl: args.baseUrl,
        json: args.json,
      });
    }
  },
});
