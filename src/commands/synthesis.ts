import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";
import type { paths } from "@suzumiyaaoba/voicevox-client";
import { defineCommand } from "citty";
import { t } from "@/i18n/index.js";
import { display, log } from "@/logger.js";
import { baseUrlOption } from "@/options.js";
import { createVoicevoxClient } from "@/utils/client.js";
import {
  ErrorType,
  handleError,
  VoicevoxError,
} from "@/utils/error-handler.js";
import { synthesisSchema, validateArgs } from "@/utils/validation.js";

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
    json: {
      type: "boolean",
      description: t("commands.synthesis.args.json"),
      alias: "j",
    },
    ...baseUrlOption,
  },
  async run({ args }) {
    // 引数のバリデーション
    const validatedArgs = validateArgs(synthesisSchema, args);

    log.debug("Starting synthesis command", {
      text: validatedArgs.text,
      speaker: validatedArgs.speaker,
      output: validatedArgs.output,
      play: validatedArgs.play,
      baseUrl: validatedArgs.baseUrl,
    });

    display.info(
      t("commands.synthesis.synthesizing", { text: validatedArgs.text }),
    );
    display.info(
      t("commands.synthesis.speakerId", { speaker: validatedArgs.speaker }),
    );
    display.info(
      t("commands.synthesis.output", {
        output: validatedArgs.output || "output.wav",
      }),
    );
    display.info(
      t("commands.synthesis.play", {
        play: String(validatedArgs.play || false),
      }),
    );

    log.debug("Synthesis command parameters processed", {
      speakerId: validatedArgs.speaker,
      outputFile: validatedArgs.output || "output.wav",
      shouldPlay: validatedArgs.play || false,
    });

    try {
      log.debug("Making synthesis API request", {
        baseUrl: validatedArgs.baseUrl,
        speaker: validatedArgs.speaker,
        text: validatedArgs.text,
      });

      const speakerId = Number(validatedArgs.speaker);
      const client = createVoicevoxClient({ baseUrl: validatedArgs.baseUrl });

      // 1. 音声クエリを生成 (POST /audio_query?speaker&text)
      const audioQueryRes = await client.POST("/audio_query", {
        params: { query: { speaker: speakerId, text: validatedArgs.text } },
      });
      if (!audioQueryRes.data) {
        throw new VoicevoxError(
          "Audio query failed: empty response",
          ErrorType.API,
          undefined,
          { speakerId, text: validatedArgs.text },
        );
      }

      // 2. 音声合成を実行 (POST /synthesis?speaker) with audioQuery body
      const synthesisRes = await client.POST("/synthesis", {
        params: { query: { speaker: speakerId } },
        body: audioQueryRes.data as paths["/synthesis"]["post"]["requestBody"]["content"]["application/json"],
        parseAs: "arrayBuffer",
      });
      if (!synthesisRes.data) {
        throw new VoicevoxError(
          "Synthesis failed: empty response",
          ErrorType.API,
          undefined,
          { speakerId, text: validatedArgs.text },
        );
      }

      // 出力ファイル名を決定
      const outputFile = validatedArgs.output || "output/synthesis.wav";

      // 音声データをファイルに保存
      writeFileSync(outputFile, Buffer.from(synthesisRes.data));

      // JSON形式で出力する場合
      if (validatedArgs.json) {
        const result = {
          success: true,
          output: outputFile,
          speaker: speakerId,
          text: validatedArgs.text,
          audioQuery: audioQueryRes.data,
          fileSize: synthesisRes.data.byteLength,
          play: validatedArgs.play || false,
        };
        const output = JSON.stringify(result, null, 2);
        display.info(output);
        return;
      }

      display.info(
        t("commands.synthesis.synthesisComplete", { output: outputFile }),
      );

      // 再生オプションが指定されている場合
      if (validatedArgs.play) {
        display.info(t("commands.synthesis.playingAudio"));
        await playAudio(outputFile);
      }

      log.debug("Synthesis command completed successfully", {
        outputFile,
        played: validatedArgs.play || false,
      });
    } catch (error) {
      handleError(error, "synthesis", {
        speaker: args.speaker,
        text: args.text,
        output: args.output,
        baseUrl: args.baseUrl,
      });
    }
  },
});
