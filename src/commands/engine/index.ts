import { defineCommand } from "citty";
import { t } from "@/i18n/index.js";
import { commonCommandOptions } from "@/utils/command-helpers.js";
import { engineManifestCommand } from "./manifest.js";

// エンジンコマンド
export const engineCommand = defineCommand({
  meta: {
    name: t("commands.engine.name"),
    description: t("commands.engine.description"),
  },
  subCommands: {
    manifest: engineManifestCommand,
  },
  args: commonCommandOptions,
});
