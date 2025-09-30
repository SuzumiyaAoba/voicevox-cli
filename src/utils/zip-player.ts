import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import AdmZip from "adm-zip";
import { t } from "@/i18n/index.js";
import { display, log } from "@/logger.js";
import { playAudio } from "./audio-player.js";

/**
 * ZIPファイルを展開して各音声ファイルを順番に再生する
 * @param zipFilePath - ZIPファイルのパス
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
      display.warn(t("commands.synthesis.noAudioFilesInZip"));
      return;
    }

    log.debug("Found audio files in ZIP", { count: audioFiles.length });
    display.info(
      t("commands.synthesis.playingMultipleAudio", {
        count: String(audioFiles.length),
      }),
    );

    // 各音声ファイルを順番に再生
    for (let i = 0; i < audioFiles.length; i++) {
      const audioFile = audioFiles[i];
      if (!audioFile) continue;

      display.info(
        t("commands.synthesis.playingAudioFile", {
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
