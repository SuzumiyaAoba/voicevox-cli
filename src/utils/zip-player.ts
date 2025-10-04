/**
 * ZIPファイル音声プレイヤーユーティリティ
 *
 * ZIPファイルに含まれる複数の音声ファイルを展開して順番に再生する機能を提供します。
 * マルチモード音声合成で生成されたZIPファイルの再生に使用されます。
 *
 * @module zip-player
 */

import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import AdmZip from "adm-zip";
import i18next from "@/i18n/config.js";
import { display, log } from "@/logger.js";
import { playAudio } from "./audio-player.js";

/**
 * ZIPファイルを展開して各音声ファイルを順番に再生する
 *
 * ZIPファイル内のすべてのWAVファイルを一時ディレクトリに展開し、
 * ファイル名順にソートして順番に再生します。
 * 再生後は一時ディレクトリを自動的にクリーンアップします。
 *
 * @param zipFilePath - 再生するZIPファイルのパス
 * @returns Promise<void> - すべての音声ファイルの再生完了時にresolveされる
 * @throws ZIPファイルの読み込みに失敗した場合
 *
 * @example
 * ```typescript
 * // マルチモード音声合成の結果を再生
 * await extractAndPlayZip("output/multi.zip");
 * ```
 */
export const extractAndPlayZip = async (zipFilePath: string): Promise<void> => {
  // 一時ディレクトリを作成
  const tempDir = mkdtempSync(join(tmpdir(), "voicevox-"));

  try {
    log.debug("Extracting ZIP file", { zipFilePath, tempDir });

    // ZIPファイルを展開
    const zip = new AdmZip(zipFilePath);
    zip.extractAllTo(tempDir, true);

    // 展開されたファイルのリストを取得
    const entries = zip.getEntries();
    const audioFiles = entries
      .filter((entry) => !entry.isDirectory && entry.entryName.endsWith(".wav"))
      .map((entry) => join(tempDir, entry.entryName))
      .sort(); // ファイル名でソート

    if (audioFiles.length === 0) {
      log.warn("No audio files found in ZIP", { zipFilePath });
      display.warn(i18next.t("commands.synthesis.noAudioFilesInZip"));
      return;
    }

    log.debug("Found audio files in ZIP", { count: audioFiles.length });
    display.info(
      i18next.t("commands.synthesis.playingMultipleAudio", {
        count: audioFiles.length,
      }),
    );

    // 各音声ファイルを順番に再生
    for (let i = 0; i < audioFiles.length; i++) {
      const audioFile = audioFiles[i];
      if (!audioFile) continue;

      display.info(
        i18next.t("commands.synthesis.playingAudioFile", {
          current: String(i + 1),
          total: String(audioFiles.length),
          file: audioFile,
        }),
      );
      await playAudio(audioFile);
    }

    log.debug("Finished playing all audio files");
  } finally {
    // 一時ディレクトリを削除
    try {
      rmSync(tempDir, { recursive: true, force: true });
      log.debug("Cleaned up temporary directory", { tempDir });
    } catch (error) {
      log.warn("Failed to clean up temporary directory", {
        tempDir,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
};
