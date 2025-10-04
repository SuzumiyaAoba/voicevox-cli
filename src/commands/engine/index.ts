import { defineCommand } from "citty";
import i18next from "@/i18n/config.js";
import { commonCommandOptions } from "@/utils/command-helpers.js";
import { engineManifestCommand } from "./manifest.js";

// エンジンコマンド
export const engineCommand = defineCommand({
  meta: {
    name: i18next.t("commands.engine.name"),
    description: i18next.t("commands.engine.description"),
  },
  subCommands: {
    manifest: engineManifestCommand,
  },
  args: commonCommandOptions,
});
