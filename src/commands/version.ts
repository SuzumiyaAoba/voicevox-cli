import { defineCommand } from "citty";
import { t } from "@/i18n/config.js";
import packageJson from "../../package.json";

/**
 * バージョン情報表示コマンド
 *
 * CLIツールのバージョン情報を表示する。
 * package.jsonから取得した情報を出力する。
 *
 * @example
 * ```bash
 * # バージョン情報を表示
 * voicevox version
 * ```
 */
export const versionCommand = defineCommand({
  meta: {
    name: t("commands.version.name"),
    description: t("commands.version.description"),
  },
  args: {},
  run() {
    console.log(`${packageJson.name} v${packageJson.version}`);
  },
});
