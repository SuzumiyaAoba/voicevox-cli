#!/usr/bin/env node

import { defineCommand, runMain } from "citty";
import { audioQueryCommand } from "@/commands/audio-query.js";
import { engineCommand } from "@/commands/engine/index.js";
import { speakersCommand } from "@/commands/speakers.js";
import { synthesisCommand } from "@/commands/synthesis.js";
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
    "audio-query": audioQueryCommand,
    speakers: speakersCommand,
    version: versionCommand,
    engine: engineCommand,
  },
});

// CLIの実行
runMain(main);
