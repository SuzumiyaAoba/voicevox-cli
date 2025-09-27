#!/usr/bin/env node

import { defineCommand, runMain } from "citty";

// 音声合成コマンド
const speakCommand = defineCommand({
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

// 話者一覧コマンド
const speakersCommand = defineCommand({
  meta: {
    name: "speakers",
    description: "List available speakers",
  },
  args: {},
  run() {
    console.log("Available speakers:");
    // TODO: Voicevox APIから話者一覧を取得
    console.log("- ID: 0, Name: ずんだもん（ノーマル）");
    console.log("- ID: 1, Name: ずんだもん（あまあま）");
    console.log("- ID: 2, Name: ずんだもん（つよつよ）");
  },
});

// バージョン情報表示コマンド
const versionCommand = defineCommand({
  meta: {
    name: "version",
    description: "Show version information",
  },
  args: {},
  run() {
    console.log("voicevox-cli v0.1.0");
  },
});

// メインコマンド
const main = defineCommand({
  meta: {
    name: "voicevox",
    version: "0.1.0",
    description: "CLI tool for VOICEVOX speech synthesis",
  },
  subCommands: {
    speak: speakCommand,
    speakers: speakersCommand,
    version: versionCommand,
  },
});

// CLIの実行
runMain(main);
