import { speakers } from "@suzumiyaaoba/voicevox-client";
import { defineCommand } from "citty";
import { display, log } from "../logger.js";

// 話者一覧コマンド
export const speakersCommand = defineCommand({
  meta: {
    name: "speakers",
    description: "List available speakers",
  },
  args: {},
  async run({ args }) {
    try {
      log.debug("Starting speakers command", { baseUrl: args["baseUrl"] });
      display.info("Fetching available speakers...");

      // カスタムfetchでベースURLを設定
      const originalFetch = globalThis.fetch;
      globalThis.fetch = (
        input: RequestInfo | URL,
        init?: RequestInit,
      ): Promise<Response> => {
        const url =
          typeof input === "string" ? `${args["baseUrl"]}${input}` : input;
        log.debug("Making API request", { url });
        return originalFetch(url, init);
      };

      const response = await speakers();

      // 元のfetchを復元
      globalThis.fetch = originalFetch;

      log.debug("API response received", {
        status: response.status,
        dataLength: Array.isArray(response.data) ? response.data.length : 0,
      });

      if (response.status !== 200) {
        display.error(`Failed to fetch speakers (Status: ${response.status})`);
        process.exit(1);
      }

      if (!Array.isArray(response.data)) {
        display.error("Invalid response format");
        process.exit(1);
      }

      // 文字列の実際の表示幅を計算する関数（日本語は2文字分）
      const getDisplayWidth = (str: string): number => {
        let width = 0;
        for (const char of str) {
          const code = char.codePointAt(0);
          if (!code) continue;

          // 日本語文字（ひらがな、カタカナ、漢字、全角記号）は2文字分
          if (
            (code >= 0x3040 && code <= 0x309f) || // ひらがな
            (code >= 0x30a0 && code <= 0x30ff) || // カタカナ
            (code >= 0x4e00 && code <= 0x9faf) || // 漢字
            (code >= 0xff00 && code <= 0xffef) || // 全角記号
            (code >= 0x3000 && code <= 0x303f) // 全角記号・句読点
          ) {
            width += 2;
          } else {
            width += 1;
          }
        }
        return width;
      };

      // パディング関数（表示幅を考慮、スペースで埋める）
      const padToWidth = (str: string, targetWidth: number): string => {
        const currentWidth = getDisplayWidth(str);
        const paddingNeeded = targetWidth - currentWidth;
        return str + " ".repeat(Math.max(0, paddingNeeded));
      };

      // ヘッダー行を固定幅で表示
      display.info(
        padToWidth("名前", 20) +
          padToWidth("UUID", 40) +
          padToWidth("Style名", 20) +
          "StyleID",
      );
      display.info("=".repeat(85));

      for (const speaker of response.data) {
        log.debug("Processing speaker", {
          name: speaker.name,
          uuid: speaker.speaker_uuid,
          stylesCount: speaker.styles?.length || 0,
        });

        if (speaker.styles && Array.isArray(speaker.styles)) {
          for (const style of speaker.styles) {
            const name = padToWidth(speaker.name, 20);
            const uuid = padToWidth(speaker.speaker_uuid, 40);
            const styleName = padToWidth(style.name, 20);
            const styleId = style.id.toString();
            display.info(`${name}${uuid}${styleName}${styleId}`);
          }
        } else {
          // スタイルがない場合
          const name = padToWidth(speaker.name, 20);
          const uuid = padToWidth(speaker.speaker_uuid, 40);
          const styleName = padToWidth("-", 20);
          const styleId = "-";
          display.info(`${name}${uuid}${styleName}${styleId}`);
        }
      }

      display.info("");
      display.info(`Total ${response.data.length} speakers found`);
      log.debug("Speakers command completed successfully");
    } catch (error) {
      log.error("Error in speakers command", {
        error: error instanceof Error ? error.message : String(error),
      });
      display.error("Error fetching speakers:");
      if (error instanceof Error) {
        display.error(`  ${error.message}`);
        if (error.message.includes("fetch")) {
          display.error(
            "  Make sure VOICEVOX Engine is running on the specified URL",
          );
        }
      } else {
        display.error("  Unknown error occurred");
      }
      process.exit(1);
    }
  },
});
