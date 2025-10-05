/**
 * エンジン情報コマンド
 *
 * VOICEVOX Engineの情報を取得するためのコマンドグループ。
 * マニフェスト情報などのサブコマンドを提供します。
 *
 * @module commands/engine
 */

import { defineCommand } from "citty";
import { t } from "@/i18n/config.js";
import { commonCommandOptions } from "@/utils/command-helpers.js";
import { engineManifestCommand } from "./manifest.js";

/**
 * エンジン情報コマンド定義
 *
 * @example
 * ```bash
 * # エンジンマニフェスト情報を表示
 * voicevox engine manifest
 * ```
 */
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
