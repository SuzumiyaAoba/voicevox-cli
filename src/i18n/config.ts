/**
 * i18next設定
 *
 * i18nextライブラリを使用した国際化設定を行います。
 * アプリケーション全体で使用される翻訳システムを初期化します。
 *
 * @module i18n/config
 */

import i18next from "i18next";
import { getLocale, translations } from "./index.js";

/**
 * 翻訳データをi18nextのリソース形式に変換
 *
 * i18nextが期待する形式に翻訳データを変換します。
 * 各ロケールの翻訳データを`translation`キーでラップします。
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
 * 同期的に初期化を行い、現在のロケールを使用して翻訳システムを設定します。
 * フォールバック言語は英語に設定されています。
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
 * 翻訳機能を使用する際は、型安全なラッパーを使用することを推奨します。
 *
 * @example
 * ```typescript
 * import { t } from "@/i18n/wrapper.js";
 *
 * // 型安全な翻訳
 * const message = t("commands.synthesis.name");
 * ```
 */
export default i18next;

/**
 * 型安全な翻訳関数を再エクスポート
 *
 * 型安全な翻訳機能を使用するための便利なエクスポートです。
 */
export {
  changeLocale,
  getCurrentLocale,
  hasTranslation,
  t,
  tPlural,
} from "./wrapper.js";
