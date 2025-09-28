#!/usr/bin/env node

import { defineCommand, runMain } from "citty";
import { engineVersionCommand } from "./commands/engine-version.js";
import { speakCommand } from "./commands/speak.js";
import { speakersCommand } from "./commands/speakers.js";
import { versionCommand } from "./commands/version.js";

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
    "engine-version": engineVersionCommand,
  },
});

// CLIの実行
runMain(main);
