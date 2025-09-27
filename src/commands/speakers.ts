import { speakers } from "@suzumiyaaoba/voicevox-client";
import { defineCommand } from "citty";
import { logUser, logDebug } from "../logger.js";

// 話者一覧コマンド
export const speakersCommand = defineCommand({
  meta: {
    name: "speakers",
    description: "List available speakers",
  },
  args: {
    baseUrl: {
      type: "string",
      description: "VOICEVOX Engine base URL (default: http://localhost:50021)",
      default: "http://localhost:50021",
    },
  },
  async run({ args }) {
    try {
      logDebug.debug("Starting speakers command", { baseUrl: args.baseUrl });
      logUser.info("Fetching available speakers...");

      // カスタムfetchでベースURLを設定
      const originalFetch = globalThis.fetch;
      globalThis.fetch = (
        input: RequestInfo | URL,
        init?: RequestInit,
      ): Promise<Response> => {
        const url =
          typeof input === "string" ? `${args.baseUrl}${input}` : input;
        logDebug.debug("Making API request", { url });
        return originalFetch(url, init);
      };

      const response = await speakers();

      // 元のfetchを復元
      globalThis.fetch = originalFetch;

      logDebug.debug("API response received", { 
        status: response.status, 
        dataLength: Array.isArray(response.data) ? response.data.length : 0 
      });

      if (response.status !== 200) {
        logUser.error(`Failed to fetch speakers (Status: ${response.status})`);
        process.exit(1);
      }

      if (!Array.isArray(response.data)) {
        logUser.error("Invalid response format");
        process.exit(1);
      }

      logUser.info("");
      logUser.info("Available speakers:");
      logUser.info("=".repeat(50));

      for (const speaker of response.data) {
        logDebug.debug("Processing speaker", { 
          name: speaker.name, 
          uuid: speaker.speaker_uuid,
          stylesCount: speaker.styles?.length || 0 
        });

        logUser.info("");
        logUser.info(`${speaker.name}`);
        logUser.info(`  UUID: ${speaker.speaker_uuid}`);

        if (speaker.styles && Array.isArray(speaker.styles)) {
          logUser.info("  Styles:");
          for (const style of speaker.styles) {
            logUser.info(`    - ${style.name} (ID: ${style.id})`);
          }
        }
      }

      logUser.info("");
      logUser.info(`Total ${response.data.length} speakers found`);
      logDebug.debug("Speakers command completed successfully");
    } catch (error) {
      logDebug.error("Error in speakers command", { error: error instanceof Error ? error.message : String(error) });
      logUser.error("Error fetching speakers:");
      if (error instanceof Error) {
        logUser.error(`  ${error.message}`);
        if (error.message.includes("fetch")) {
          logUser.error(
            "  Make sure VOICEVOX Engine is running on the specified URL",
          );
        }
      } else {
        logUser.error("  Unknown error occurred");
      }
      process.exit(1);
    }
  },
});
