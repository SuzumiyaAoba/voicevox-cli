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
  display.info("音声クエリ情報");

  const labels = [
    "速度",
    "ピッチ",
    "イントネーション",
    "音量",
    "前音素長",
    "後音素長",
    "サンプリング",
    "ステレオ",
    "カナ",
  ];
  const maxWidth = Math.max(...labels.map(getDisplayWidth));

  display.info(`${padToWidth("速度", maxWidth)} : ${audioQuery.speedScale}`);
  display.info(`${padToWidth("ピッチ", maxWidth)} : ${audioQuery.pitchScale}`);
  display.info(
    `${padToWidth("イントネーション", maxWidth)} : ${audioQuery.intonationScale}`,
  );
  display.info(`${padToWidth("音量", maxWidth)} : ${audioQuery.volumeScale}`);
  display.info(
    `${padToWidth("前音素長", maxWidth)} : ${audioQuery.prePhonemeLength}s`,
  );
  display.info(
    `${padToWidth("後音素長", maxWidth)} : ${audioQuery.postPhonemeLength}s`,
  );
  display.info(
    `${padToWidth("サンプリング", maxWidth)} : ${audioQuery.outputSamplingRate}Hz`,
  );
  display.info(
    `${padToWidth("ステレオ", maxWidth)} : ${audioQuery.outputStereo ? "ON" : "OFF"}`,
  );

  if (audioQuery.kana) {
    display.info(`${padToWidth("カナ", maxWidth)} : ${audioQuery.kana}`);
  }

  display.info("");
  display.info("アクセント句");
  audioQuery.accent_phrases.forEach((phrase, index) => {
    const moraTexts = phrase.moras.map((m) => m.text).join("");
    const accentMark =
      phrase.accent > 0 ? ` (アクセント: ${phrase.accent})` : "";
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
