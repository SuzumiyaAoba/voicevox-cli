import { defineCommand } from "citty";
import { display, log } from "../logger.js";

// 音声合成コマンド
export const speakCommand = defineCommand({
  meta: {
    name: "speak",
    description: "Synthesize speech from text",
  },
  args: {
    text: {
      type: "positional",
      description: "Text to synthesize",
      required: true,
    },
    speaker: {
      type: "string",
      description: "Speaker ID (default: 0)",
      alias: "s",
      default: "0",
    },
    output: {
      type: "string",
      description: "Output file path",
      alias: "o",
    },
    play: {
      type: "boolean",
      description: "Play audio after synthesis",
    },
  },
  run({ args }) {
    log.debug("Starting speak command", {
      text: args.text,
      speaker: args.speaker,
      output: args.output,
      play: args.play,
    });

    display.info(`Synthesizing: "${args.text}"`);
    display.info(`Speaker ID: ${args.speaker}`);
    display.info(`Output: ${args.output || "default.wav"}`);
    display.info(`Play: ${args.play || false}`);

    log.debug("Speak command parameters processed", {
      speakerId: args.speaker,
      outputFile: args.output || "default.wav",
      shouldPlay: args.play || false,
    });

    // TODO: Voicevox API呼び出しの実装
  },
});
