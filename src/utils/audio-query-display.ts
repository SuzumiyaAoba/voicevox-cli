import i18next from "@/i18n/config.js";
import { display } from "@/logger.js";
import { getDisplayWidth, padToWidth } from "@/utils/display.js";

// Minimal AudioQuery type surface for display purposes
type AccentPhrase = {
  accent: number;
  is_interrogative?: boolean;
  moras: Array<{
    text: string;
    consonant?: string | null;
    vowel: string;
    consonant_length?: number | null;
    vowel_length: number;
    pitch: number;
  }>;
};

export type AudioQueryLike = {
  speedScale: number;
  pitchScale: number;
  intonationScale: number;
  volumeScale: number;
  prePhonemeLength: number;
  postPhonemeLength: number;
  outputSamplingRate: number;
  outputStereo: boolean;
  kana?: string;
  accent_phrases: AccentPhrase[];
};

export const displayAudioQueryInfo = (audioQuery: AudioQueryLike): void => {
  display.info("");
  display.info(i18next.t("commands.query.audioQueryInfo.title"));

  const labels = [
    i18next.t("commands.query.audioQueryInfo.speed"),
    i18next.t("commands.query.audioQueryInfo.pitch"),
    i18next.t("commands.query.audioQueryInfo.intonation"),
    i18next.t("commands.query.audioQueryInfo.volume"),
    i18next.t("commands.query.audioQueryInfo.prePhonemeLength"),
    i18next.t("commands.query.audioQueryInfo.postPhonemeLength"),
    i18next.t("commands.query.audioQueryInfo.sampling"),
    i18next.t("commands.query.audioQueryInfo.stereo"),
    i18next.t("commands.query.audioQueryInfo.kana"),
  ];
  const maxWidth = Math.max(...labels.map(getDisplayWidth));

  display.info(
    `${padToWidth(labels[0] || "速度", maxWidth)} : ${audioQuery.speedScale}`,
  );
  display.info(
    `${padToWidth(labels[1] || "ピッチ", maxWidth)} : ${audioQuery.pitchScale}`,
  );
  display.info(
    `${padToWidth(labels[2] || "イントネーション", maxWidth)} : ${audioQuery.intonationScale}`,
  );
  display.info(
    `${padToWidth(labels[3] || "音量", maxWidth)} : ${audioQuery.volumeScale}`,
  );
  display.info(
    `${padToWidth(labels[4] || "前音素長", maxWidth)} : ${audioQuery.prePhonemeLength}s`,
  );
  display.info(
    `${padToWidth(labels[5] || "後音素長", maxWidth)} : ${audioQuery.postPhonemeLength}s`,
  );
  display.info(
    `${padToWidth(labels[6] || "サンプリング", maxWidth)} : ${audioQuery.outputSamplingRate}Hz`,
  );
  display.info(
    `${padToWidth(labels[7] || "ステレオ", maxWidth)} : ${audioQuery.outputStereo ? i18next.t("commands.query.audioQueryInfo.on") || "ON" : i18next.t("commands.query.audioQueryInfo.off") || "OFF"}`,
  );

  if (audioQuery.kana) {
    display.info(
      `${padToWidth(labels[8] || "カナ", maxWidth)} : ${audioQuery.kana}`,
    );
  }

  display.info("");
  display.info(
    i18next.t("commands.query.audioQueryInfo.accentPhrases") || "アクセント句",
  );
  audioQuery.accent_phrases.forEach((phrase, index) => {
    const moraTexts = phrase.moras.map((m) => m.text).join("");
    const accentMark =
      phrase.accent > 0
        ? ` (${i18next.t("commands.query.audioQueryInfo.accent") || "アクセント"}: ${phrase.accent})`
        : "";
    const questionMark = phrase.is_interrogative ? "?" : "";
    display.info(`  ${index + 1}. ${moraTexts}${accentMark}${questionMark}`);

    const moraDetails = phrase.moras
      .map((m) => {
        const consonant = m.consonant || "";
        const vowel = m.vowel;
        const length = (m.consonant_length || 0) + m.vowel_length;
        const pitch = m.pitch.toFixed(1);
        return `${m.text}(${consonant}${vowel}:${length.toFixed(2)}s:${pitch}Hz)`;
      })
      .join(" ");

    display.info(`     ${moraDetails}`);
  });
};
