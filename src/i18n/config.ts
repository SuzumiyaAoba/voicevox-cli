import i18next from "i18next";
import { getLocale, translations } from "./index.js";

/**
 * 翻訳データをi18nextのリソース形式に変換
 *
 * i18nextが期待する形式に翻訳データを変換する。
 * 各ロケールの翻訳データを`translation`キーでラップする。
 */
const resources = {
  ja: {
    translation: translations.ja,
  },
  en: {
    translation: translations.en,
  },
};

/**
 * i18nextの初期化設定
 *
 * 同期的に初期化を行い、現在のロケールを使用して翻訳システムを設定する。
 * フォールバック言語は英語に設定されている。
 */
i18next.init({
  lng: getLocale(), // 現在のロケールを使用
  fallbackLng: "en",
  resources,
  interpolation: {
    escapeValue: false, // Reactは使用していないのでfalse
  },
  debug: false, // デバッグを無効にする
  initImmediate: false, // 同期的に初期化
});

/**
 * 初期化済みのi18nextインスタンス
 *
 * 翻訳機能を使用する際は、このインスタンスを使用する。
 *
 * @example
 * ```typescript
 * import i18next from "@/i18n/config.js";
 *
 * // 翻訳を取得
 * const message = i18next.t("commands.synthesis.name");
 * ```
 */
export default i18next;
