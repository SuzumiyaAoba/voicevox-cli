/**
 * 数値パーサーユーティリティ
 *
 * コマンドライン引数からの数値パース用のZodスキーマファクトリを提供します。
 * バリデーション機能を含む型安全なパーサーを生成します。
 *
 * @module number-parser
 */

import { z } from "zod";

/**
 * 文字列を非負の整数に変換するZodスキーマファクトリ
 *
 * @param fieldName - フィールド名（エラーメッセージ用）
 * @returns 非負整数検証用のZodスキーマ
 */
export const createNonNegativeIntSchema = (fieldName: string) =>
  z.string().transform((val) => {
    const num = Number(val);
    if (Number.isNaN(num) || num < 0 || !Number.isInteger(num)) {
      throw new Error(`${fieldName} must be a non-negative integer`);
    }
    return num;
  });

/**
 * 文字列を指定範囲の数値に変換するZodスキーマファクトリ
 * @param fieldName - フィールド名（エラーメッセージ用）
 * @param min - 最小値
 * @param max - 最大値
 * @returns Zodスキーマ
 */
export const createRangeNumberSchema = (
  fieldName: string,
  min: number,
  max: number,
) =>
  z.string().transform((val) => {
    const num = Number(val);
    if (Number.isNaN(num)) {
      throw new Error(`${fieldName} must be a number`);
    }
    if (num < min || num > max) {
      throw new Error(`${fieldName} must be between ${min} and ${max}`);
    }
    return num;
  });
