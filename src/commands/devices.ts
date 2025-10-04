import { defineCommand } from "citty";
import i18next from "@/i18n/config.js";
import { display, log } from "@/logger.js";
import { createClient, validateResponse } from "@/utils/api-helpers.js";
import { commonCommandOptions } from "@/utils/command-helpers.js";
import { handleError } from "@/utils/error-handler.js";
import { outputConditional } from "@/utils/output.js";

/**
 * 対応デバイス一覧コマンド
 *
 * VOICEVOX Engineがサポートするデバイス情報を取得し、表示する。
 * CPU、CUDA、DMLなどの対応状況を確認できる。
 *
 * @example
 * ```bash
 * # 対応デバイス一覧を表示
 * voicevox devices
 *
 * # JSON形式で出力
 * voicevox devices --json
 *
 * # 別のエンジンから取得
 * voicevox devices --baseUrl http://localhost:8080
 * ```
 */
export const devicesCommand = defineCommand({
  meta: {
    name: i18next.t("commands.devices.name"),
    description: i18next.t("commands.devices.description"),
  },
  args: commonCommandOptions,
  async run({ args }) {
    try {
      log.debug("Starting devices command", { baseUrl: args.baseUrl });

      const client = createClient(args.baseUrl);

      display.info(i18next.t("commands.devices.fetching"));

      log.debug("Making API request", { baseUrl: args.baseUrl });

      const response = await client.GET("/supported_devices");
      const devices = validateResponse(
        response,
        i18next.t("commands.devices.errorFetching"),
        { baseUrl: args.baseUrl },
      );

      log.debug("API response received", {
        dataType: typeof devices,
        deviceCount: Array.isArray(devices) ? devices.length : "unknown",
      });

      // 出力処理
      outputConditional(args.json || false, devices, () => {
        // 対応デバイス情報を整形して表示
        let devicesInfo = `\n${i18next.t("commands.devices.devicesInfo")}:`;

        // デバイス情報を表示
        if (devices && typeof devices === "object") {
          Object.entries(devices).forEach(([key, value]) => {
            devicesInfo += `\n${key}: ${value}`;
          });
        } else {
          devicesInfo += `\n${i18next.t("commands.devices.noDeviceInfo")}`;
        }

        display.info(devicesInfo);
      });

      log.debug("Devices command completed successfully");
    } catch (error) {
      handleError(error, "devices", {
        baseUrl: args.baseUrl,
        json: args.json,
      });
    }
  },
});
