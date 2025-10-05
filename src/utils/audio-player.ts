/**
 * 音声プレイヤーユーティリティ
 *
 * プラットフォームに応じた音声ファイルの再生機能を提供します。
 * macOS、Windows、Linuxの各プラットフォームに対応しています。
 *
 * @module audio-player
 */

import { spawn } from "node:child_process";
import { t } from "@/i18n/config.js";
import { display, log } from "@/logger.js";

/**
 * 音声ファイルを再生する関数
 *
 * プラットフォームに応じて適切な音声プレイヤーを使用して音声ファイルを再生します。
 *
 * - macOS: afplayコマンドを使用
 * - Windows: PowerShellのMedia.SoundPlayerを使用
 * - Linux: aplayコマンドを使用
 *
 * プレイヤーが見つからない場合やエラーが発生した場合は警告を表示しますが、
 * 処理は継続します（例外を投げません）。
 *
 * @param filePath - 再生する音声ファイルのパス
 * @returns Promise<void> - 再生完了時にresolveされるPromise
 *
 * @example
 * ```typescript
 * // WAVファイルを再生
 * await playAudio("output.wav");
 * ```
 */
export const playAudio = (filePath: string): Promise<void> => {
  return new Promise((resolve) => {
    // プラットフォームに応じて適切なプレイヤーを選択
    let player: string;
    let args: string[];

    if (process.platform === "darwin") {
      // macOS
      player = "afplay";
      args = [filePath];
    } else if (process.platform === "win32") {
      // Windows
      player = "powershell";
      args = ["-c", `(New-Object Media.SoundPlayer '${filePath}').PlaySync()`];
    } else {
      // Linux
      player = "aplay";
      args = [filePath];
    }

    const child = spawn(player, args, { stdio: "ignore" });

    child.on("error", (error) => {
      log.warn("Audio player not found or failed", { error: error.message });
      display.warn(t("commands.synthesis.playerNotFound"));
      resolve(); // エラーでも処理を続行
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        log.warn("Audio player exited with code", { code });
        display.warn(t("commands.synthesis.playerError"));
        resolve(); // エラーでも処理を続行
      }
    });
  });
};
