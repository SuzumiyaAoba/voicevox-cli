#!/usr/bin/env node

import { defineCommand, runMain } from "citty";
import { coreCommand } from "@/commands/core/index.js";
import { devicesCommand } from "@/commands/devices.js";
import { engineCommand } from "@/commands/engine/index.js";
import { kanaCommand } from "@/commands/kana/index.js";
import { presetsCommand } from "@/commands/presets/index.js";
import { queryCommand } from "@/commands/query/index.js";
import { settingCommand } from "@/commands/setting.js";
import { speakersCommand } from "@/commands/speakers.js";
import { synthesisCommand } from "@/commands/synthesis/index.js";
import { versionCommand } from "@/commands/version.js";

/**
 * VOICEVOX CLI メインコマンド定義
 *
 * VOICEVOX Engine APIを使用した音声合成CLIツールのメインエントリーポイント。
 * 複数のサブコマンドを提供し、音声合成、話者管理、設定管理などの機能を提供する。
 *
 * @example
 * ```bash
 * # 音声合成
 * voicevox synthesis "こんにちは"
 *
 * # 話者一覧表示
 * voicevox speakers
 *
 * # エンジン情報表示
 * voicevox engine manifest
 * ```
 */
const main = defineCommand({
  meta: {
    name: "voicevox",
    version: "0.1.0",
    description: "CLI tool for VOICEVOX speech synthesis",
  },
  subCommands: {
    synthesis: synthesisCommand,
    query: queryCommand,
    speakers: speakersCommand,
    setting: settingCommand,
    presets: presetsCommand,
    version: versionCommand,
    engine: engineCommand,
    core: coreCommand,
    kana: kanaCommand,
    devices: devicesCommand,
  },
});

/**
 * CLIアプリケーションの実行
 *
 * メインコマンドを実行し、ユーザーからの引数に基づいて適切なサブコマンドを呼び出す。
 * エラーハンドリングは各コマンド内で行われる。
 */
runMain(main);
