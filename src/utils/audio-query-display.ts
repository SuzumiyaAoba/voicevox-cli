import i18next from "@/i18n/config.js";
import { display } from "@/logger.js";
import { getDisplayWidth, padToWidth } from "@/utils/display.js";

/**
 * アクセント句の型定義
 *
 * 音声クエリのアクセント句情報を表す型。
 * アクセント位置、疑問文フラグ、モーラ情報を含む。
 */
type AccentPhrase = {
  /** アクセント位置 */
  accent: number;
  /** 疑問文かどうか */
  is_interrogative?: boolean;
  /** モーラ情報の配列 */
  moras: Array<{
    /** テキスト */
    text: string;
    /** 子音（オプション） */
    consonant?: string | null;
    /** 母音 */
    vowel: string;
    /** 子音の長さ（オプション） */
    consonant_length?: number | null;
    /** 母音の長さ */
    vowel_length: number;
    /** ピッチ */
    pitch: number;
  }>;
};

/**
 * 音声クエリ表示用の型定義
 *
 * 音声クエリの情報を表示するために必要な最小限の型定義。
 * VOICEVOX Engine APIのAudioQueryレスポンスと互換性がある。
 *
 * @example
 * ```typescript
 * const audioQuery: AudioQueryLike = {
 *   speedScale: 1.0,
 *   pitchScale: 0.0,
 *   intonationScale: 1.0,
 *   volumeScale: 1.0,
 *   prePhonemeLength: 0.1,
 *   postPhonemeLength: 0.1,
 *   outputSamplingRate: 24000,
 *   outputStereo: false,
 *   kana: "コンニチハ",
 *   accent_phrases: [...]
 * };
 * ```
 */
export type AudioQueryLike = {
  /** 速度スケール */
  speedScale: number;
  /** ピッチスケール */
  pitchScale: number;
  /** イントネーションスケール */
  intonationScale: number;
  /** 音量スケール */
  volumeScale: number;
  /** 前音素長（秒） */
  prePhonemeLength: number;
  /** 後音素長（秒） */
  postPhonemeLength: number;
  /** 出力サンプリングレート（Hz） */
  outputSamplingRate: number;
  /** ステレオ出力かどうか */
  outputStereo: boolean;
  /** カナ表記（オプション） */
  kana?: string;
  /** アクセント句の配列 */
  accent_phrases: AccentPhrase[];
};

/**
 * 音声クエリ情報を表示する関数
 *
 * 音声クエリの詳細情報を整形してコンソールに表示する。
 * 速度、ピッチ、イントネーションなどのパラメータと、
 * アクセント句の詳細情報を表示する。
 *
 * @param audioQuery - 表示する音声クエリ情報
 *
 * @example
 * ```typescript
 * const audioQuery: AudioQueryLike = {
 *   speedScale: 1.0,
 *   pitchScale: 0.0,
 *   // ... その他のプロパティ
 * };
 *
 * displayAudioQueryInfo(audioQuery);
 * ```
 */
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
