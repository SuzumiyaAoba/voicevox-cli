import { defineCommand } from "citty";
import i18next from "@/i18n/config.js";
import { display, log } from "@/logger.js";
import { createClient, validateResponse } from "@/utils/api-helpers.js";
import { commonCommandOptions } from "@/utils/command-helpers.js";
import { handleError } from "@/utils/error-handler.js";
import { outputConditional } from "@/utils/output.js";

// 対応デバイス一覧コマンド
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
        const labels = {
          fetching: i18next.t("commands.devices.fetching"),
          devicesInfo: i18next.t("commands.devices.devicesInfo"),
          deviceName: i18next.t("commands.devices.deviceName"),
          deviceType: i18next.t("commands.devices.deviceType"),
          deviceId: i18next.t("commands.devices.deviceId"),
          deviceUuid: i18next.t("commands.devices.deviceUuid"),
          deviceModel: i18next.t("commands.devices.deviceModel"),
          deviceSpeaker: i18next.t("commands.devices.deviceSpeaker"),
          deviceSpeakerUuid: i18next.t("commands.devices.deviceSpeakerUuid"),
          deviceSpeakerName: i18next.t("commands.devices.deviceSpeakerName"),
          deviceSpeakerSpeakerUuid: i18next.t(
            "commands.devices.deviceSpeakerSpeakerUuid",
          ),
          deviceSpeakerSpeakerName: i18next.t(
            "commands.devices.deviceSpeakerSpeakerName",
          ),
          deviceSpeakerSpeakerStyleId: i18next.t(
            "commands.devices.deviceSpeakerSpeakerStyleId",
          ),
          deviceSpeakerSpeakerStyleName: i18next.t(
            "commands.devices.deviceSpeakerSpeakerStyleName",
          ),
          deviceSpeakerSpeakerVoiceSamples: i18next.t(
            "commands.devices.deviceSpeakerSpeakerVoiceSamples",
          ),
        };

        let devicesInfo = `${labels.fetching}

${labels.devicesInfo}:`;

        // デバイス情報を表示
        if (devices && typeof devices === "object") {
          Object.entries(devices).forEach(([key, value]) => {
            devicesInfo += `
${key}: ${value}`;
          });
        } else {
          devicesInfo += "\nNo device information available";
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
