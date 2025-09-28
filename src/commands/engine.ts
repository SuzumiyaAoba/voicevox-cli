import { defineCommand } from "citty";
import { engineVersionCommand } from "./engine-version.js";

// エンジン関連コマンド
export const engineCommand = defineCommand({
  meta: {
    name: "engine",
    description: "VOICEVOX Engine related commands",
  },
  subCommands: {
    version: engineVersionCommand,
  },
});
