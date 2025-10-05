/**
 * 型安全なi18nextラッパー
 *
 * i18nextを型安全にラップして、翻訳キーの型チェックを提供します。
 * 翻訳キーは型安全に指定でき、存在しないキーはコンパイル時にエラーになります。
 *
 * @module i18n/wrapper
 */

import i18next from "./config.js";
import type { TranslationKey, TranslationParams } from "./types.js";

/**
 * 型安全な翻訳関数
 *
 * 翻訳キーを型安全に指定でき、存在しないキーはコンパイル時にエラーになります。
 * パラメータも型安全に渡すことができます。
 *
 * @param key - 翻訳キー（型安全）
 * @param params - 翻訳パラメータ（オプション）
 * @returns 翻訳された文字列
 *
 * @example
 * ```typescript
 * import { t } from "@/i18n/wrapper.js";
 *
 * // 型安全な翻訳
 * const message = t("commands.synthesis.name"); // ✅ 型安全
 * const messageWithParams = t("commands.synthesis.synthesizing", { text: "Hello" }); // ✅ 型安全
 *
 * // 存在しないキーはコンパイルエラー
 * const invalid = t("invalid.key"); // ❌ コンパイルエラー
 * ```
 */
export const t = (key: TranslationKey, params?: TranslationParams): string => {
  return i18next.t(key, params);
};

/**
 * 型安全な翻訳関数（複数形対応）
 *
 * 複数形の翻訳を型安全に処理します。
 *
 * @param key - 翻訳キー（型安全）
 * @param count - 複数形の判定に使用する数値
 * @param params - 翻訳パラメータ（オプション）
 * @returns 翻訳された文字列
 *
 * @example
 * ```typescript
 * import { tPlural } from "@/i18n/wrapper.js";
 *
 * const message = tPlural("commands.synthesis.totalSpeakers", 5, { count: 5 });
 * ```
 */
export const tPlural = (
  key: TranslationKey,
  count: number,
  params?: TranslationParams,
): string => {
  return i18next.t(key, { count, ...params });
};

/**
 * 現在のロケールを取得
 *
 * @returns 現在のロケール
 */
export const getCurrentLocale = (): string => {
  return i18next.language;
};

/**
 * ロケールを変更
 *
 * @param locale - 新しいロケール
 */
export const changeLocale = (locale: string): void => {
  i18next.changeLanguage(locale);
};

/**
 * 翻訳が利用可能かどうかを確認
 *
 * @param key - 翻訳キー
 * @returns 翻訳が利用可能かどうか
 */
export const hasTranslation = (key: TranslationKey): boolean => {
  return i18next.exists(key);
};

/**
 * 型安全なi18nextインスタンス
 *
 * 直接i18nextインスタンスにアクセスする必要がある場合に使用します。
 * 通常は`t`関数を使用することを推奨します。
 */
export { default as i18next } from "./config.js";
