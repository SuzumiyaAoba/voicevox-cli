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

// メインコマンド
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

// CLIの実行
runMain(main);
