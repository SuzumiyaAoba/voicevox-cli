import type { paths } from "@suzumiyaaoba/voicevox-client";
import { defineCommand } from "citty";
import openapiFetch from "openapi-fetch";
import { display, log } from "../logger.js";
import { baseUrlOption } from "../options.js";

// 話者一覧コマンド
export const speakersCommand = defineCommand({
  meta: {
    name: "speakers",
    description: "List available speakers",
  },
  args: {
    json: {
      type: "boolean",
      description: "Output in JSON format",
      alias: "j",
    },
    ...baseUrlOption,
  },
  async run({ args }) {
    try {
      log.debug("Starting speakers command", { baseUrl: args.baseUrl });

      // ベースURLを指定してクライアントを作成
      const client = openapiFetch<paths>({
        baseUrl: args.baseUrl,
      });

      log.debug("Making API request", { baseUrl: args.baseUrl });

      // APIクライアントを使用してspeakersエンドポイントにアクセス
      const response = await client.GET("/speakers");

      log.debug("API response received", {
        dataLength: Array.isArray(response.data) ? response.data.length : 0,
      });

      if (!response.data || !Array.isArray(response.data)) {
        display.error("Invalid response format");
        process.exit(1);
      }

      // JSON形式で出力する場合
      if (args.json) {
        const output = JSON.stringify(response.data, null, 2);
        console.log(output);
        return;
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

      // テーブル形式の出力を文字列として構築
      let tableOutput = "Fetching available speakers...\n\n";

      // ヘッダー行を固定幅で表示
      const headerLine =
        padToWidth("名前", 20) +
        padToWidth("UUID", 40) +
        padToWidth("Style名", 20) +
        "StyleID";
      tableOutput += `${headerLine}\n`;

      // ヘッダー行の表示幅に合わせて区切り線を生成
      const headerWidth = getDisplayWidth(headerLine);
      tableOutput += `${"=".repeat(headerWidth)}\n`;

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
            tableOutput += `${name}${uuid}${styleName}${styleId}\n`;
          }
        } else {
          // スタイルがない場合
          const name = padToWidth(speaker.name, 20);
          const uuid = padToWidth(speaker.speaker_uuid, 40);
          const styleName = padToWidth("-", 20);
          const styleId = "-";
          tableOutput += `${name}${uuid}${styleName}${styleId}\n`;
        }
      }

      tableOutput += "\n";
      tableOutput += `Total ${response.data.length} speakers found\n`;

      // 直接出力
      console.log(tableOutput);
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
