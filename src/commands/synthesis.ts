import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";
import { defineCommand } from "citty";
import { t } from "@/i18n/index.js";
import { display, log } from "@/logger.js";
import { baseUrlOption } from "@/options.js";

// 音声ファイルを再生する関数
const playAudio = (filePath: string): Promise<void> => {
  return new Promise((resolve) => {
    // プラットフォームに応じて適切なプレイヤーを選択
    let player: string;
    let args: string[];

    if (process.platform === "darwin") {
      // macOS
      player = "afplay";
      args = [filePath];
    } else if (process.platform === "win32") {
      // Windows
      player = "powershell";
      args = ["-c", `(New-Object Media.SoundPlayer '${filePath}').PlaySync()`];
    } else {
      // Linux
      player = "aplay";
      args = [filePath];
    }

    const child = spawn(player, args, { stdio: "ignore" });

    child.on("error", (error) => {
      log.warn("Audio player not found or failed", { error: error.message });
      display.warn(t("commands.synthesis.playerNotFound"));
      resolve(); // エラーでも処理を続行
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        log.warn("Audio player exited with code", { code });
        display.warn(t("commands.synthesis.playerError"));
        resolve(); // エラーでも処理を続行
      }
    });
  });
};

// 音声合成コマンド
export const synthesisCommand = defineCommand({
  meta: {
    name: t("commands.synthesis.name"),
    description: t("commands.synthesis.description"),
  },
  args: {
    text: {
      type: "positional",
      description: t("commands.synthesis.args.text"),
      required: true,
    },
    speaker: {
      type: "string",
      description: t("commands.synthesis.args.speaker"),
      alias: "s",
      default: "2",
    },
    output: {
      type: "string",
      description: t("commands.synthesis.args.output"),
      alias: "o",
    },
    play: {
      type: "boolean",
      description: t("commands.synthesis.args.play"),
    },
    ...baseUrlOption,
  },
  async run({ args }) {
    log.debug("Starting synthesis command", {
      text: args.text,
      speaker: args.speaker,
      output: args.output,
      play: args.play,
      baseUrl: args.baseUrl,
    });

    display.info(t("commands.synthesis.synthesizing", { text: args.text }));
    display.info(t("commands.synthesis.speakerId", { speaker: args.speaker }));
    display.info(
      t("commands.synthesis.output", { output: args.output || "output.wav" }),
    );
    display.info(
      t("commands.synthesis.play", { play: String(args.play || false) }),
    );

    log.debug("Synthesis command parameters processed", {
      speakerId: args.speaker,
      outputFile: args.output || "output.wav",
      shouldPlay: args.play || false,
    });

    try {
      log.debug("Making synthesis API request", {
        baseUrl: args.baseUrl,
        speaker: args.speaker,
        text: args.text,
      });

      // 1. 音声クエリを生成
      const audioQueryResponse = await fetch(
        `${args.baseUrl}/audio_query?speaker=${args.speaker}&text=${encodeURIComponent(args.text)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!audioQueryResponse.ok) {
        const errorText = await audioQueryResponse.text();
        throw new Error(
          `Audio query failed: HTTP ${audioQueryResponse.status}: ${errorText}`,
        );
      }

      const audioQuery = await audioQueryResponse.json();

      // 2. 音声合成を実行
      const response = await fetch(
        `${args.baseUrl}/synthesis?speaker=${args.speaker}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(audioQuery),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const audioData = await response.arrayBuffer();

      // 出力ファイル名を決定
      const outputFile = args.output || "output.wav";

      // 音声データをファイルに保存
      writeFileSync(outputFile, Buffer.from(audioData));

      display.info(
        t("commands.synthesis.synthesisComplete", { output: outputFile }),
      );

      // 再生オプションが指定されている場合
      if (args.play) {
        display.info(t("commands.synthesis.playingAudio"));
        await playAudio(outputFile);
      }

      log.debug("Synthesis command completed successfully", {
        outputFile,
        played: args.play || false,
      });
    } catch (error) {
      log.error("Error in synthesis command", {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      display.error(t("commands.synthesis.synthesisError"));
      if (error instanceof Error) {
        display.error(`  ${error.message}`);
        if (error.message.includes("fetch")) {
          display.error(t("commands.synthesis.makeSureEngineRunning"));
        }
      } else {
        display.error(`  ${t("common.unknown")}`);
      }
      process.exit(1);
    }
  },
});
