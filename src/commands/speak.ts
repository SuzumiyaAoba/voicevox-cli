import { defineCommand } from "citty";

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
    console.log(`Synthesizing: "${args.text}"`);
    console.log(`Speaker ID: ${args.speaker}`);
    console.log(`Output: ${args.output || "default.wav"}`);
    console.log(`Play: ${args.play || false}`);
    // TODO: Voicevox API呼び出しの実装
  },
});
