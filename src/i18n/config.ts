import i18next from "i18next";
import { getLocale, translations } from "./index.js";

// 翻訳データをi18nextのリソース形式に変換
const resources = {
  ja: {
    translation: translations.ja,
  },
  en: {
    translation: translations.en,
  },
};

// i18nextの初期化（同期的に実行）
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

export default i18next;
