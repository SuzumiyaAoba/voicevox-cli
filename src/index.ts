#!/usr/bin/env node

import { cac } from "cac";

const cli = cac("voicevox");

// バージョン情報
cli.version("0.1.0");

// ヘルプメッセージ
cli.help();

// デフォルトコマンド（引数なしの場合）
cli.command("", "Show help information").action(() => {
  cli.outputHelp();
});

// 音声合成コマンド
cli
  .command("speak <text>", "Synthesize speech from text")
  .option("-s, --speaker <id>", "Speaker ID (default: 0)", { default: 0 })
  .option("-o, --output <file>", "Output file path")
  .option("--play", "Play audio after synthesis")
  .action((text: string, options) => {
    console.log(`Synthesizing: "${text}"`);
    console.log(`Speaker ID: ${options.speaker}`);
    console.log(`Output: ${options.output || "default.wav"}`);
    console.log(`Play: ${options.play || false}`);
    // TODO: Voicevox API呼び出しの実装
  });

// 話者一覧コマンド
cli.command("speakers", "List available speakers").action(() => {
  console.log("Available speakers:");
  // TODO: Voicevox APIから話者一覧を取得
  console.log("- ID: 0, Name: ずんだもん（ノーマル）");
  console.log("- ID: 1, Name: ずんだもん（あまあま）");
  console.log("- ID: 2, Name: ずんだもん（つよつよ）");
});

// バージョン情報表示
cli.command("version", "Show version information").action(() => {
  console.log("voicevox-cli v0.1.0");
});

// CLIの解析と実行
cli.parse();
