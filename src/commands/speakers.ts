import { speakers } from "@suzumiyaaoba/voicevox-client";
import { defineCommand } from "citty";

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
      console.log("Fetching available speakers...");

      // カスタムfetchでベースURLを設定
      const originalFetch = globalThis.fetch;
      globalThis.fetch = (
        input: RequestInfo | URL,
        init?: RequestInit,
      ): Promise<Response> => {
        const url =
          typeof input === "string" ? `${args.baseUrl}${input}` : input;
        return originalFetch(url, init);
      };

      const response = await speakers();

      // 元のfetchを復元
      globalThis.fetch = originalFetch;

      if (response.status !== 200) {
        console.error(`Failed to fetch speakers (Status: ${response.status})`);
        process.exit(1);
      }

      if (!Array.isArray(response.data)) {
        console.error("Invalid response format");
        process.exit(1);
      }

      console.log("");
      console.log("Available speakers:");
      console.log("=".repeat(50));

      for (const speaker of response.data) {
        console.log("");
        console.log(`${speaker.name}`);
        console.log(`  UUID: ${speaker.speaker_uuid}`);

        if (speaker.styles && Array.isArray(speaker.styles)) {
          console.log("  Styles:");
          for (const style of speaker.styles) {
            console.log(`    - ${style.name} (ID: ${style.id})`);
          }
        }
      }

      console.log("");
      console.log(`Total ${response.data.length} speakers found`);
    } catch (error) {
      console.error("Error fetching speakers:");
      if (error instanceof Error) {
        console.error(`  ${error.message}`);
        if (error.message.includes("fetch")) {
          console.error(
            "  Make sure VOICEVOX Engine is running on the specified URL",
          );
        }
      } else {
        console.error("  Unknown error occurred");
      }
      process.exit(1);
    }
  },
});
