/**
 * バリデーションユーティリティ
 *
 * Zodを使用した共通のバリデーションスキーマとヘルパー関数を提供します。
 * 複数のコマンドで共有される基本的なバリデーションロジックを定義します。
 *
 * @module validation
 */

import { z } from "zod";

// ========================================
// 共通の基本スキーマ
// ========================================

/**
 * ベースURL検証スキーマ
 */
export const baseUrlSchema = z.string().url("Invalid base URL format");

/**
 * 話者ID検証スキーマ
 */
export const speakerIdSchema = z.string().min(1, "Speaker ID is required");

/**
 * テキスト検証スキーマ
 */
export const textSchema = z
  .string()
  .min(1, "Text is required")
  .max(1000, "Text is too long");

/**
 * 出力ファイルパス検証スキーマ
 */
export const outputFileSchema = z
  .string()
  .min(1, "Output file path is required");

/**
 * 入力ファイルパス検証スキーマ
 */
export const inputFileSchema = z.string().min(1, "Input file path is required");

/**
 * 出力タイプ検証スキーマ
 */
export const outputTypeSchema = z.union([z.literal("json"), z.literal("text")]);

// ========================================
// バリデーションヘルパー
// ========================================

/**
 * Zodスキーマを使用して引数をバリデーションする
 *
 * @param schema - Zodスキーマ
 * @param args - バリデーション対象の引数
 * @returns バリデーション済みの引数
 * @throws バリデーションエラー
 *
 * @example
 * ```typescript
 * const validatedArgs = validateArgs(mySchema, args);
 * ```
 */
export const validateArgs = <T>(schema: z.ZodSchema<T>, args: unknown): T => {
  try {
    return schema.parse(args);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map((err) => {
        const path = err.path.join(".");
        return `${path}: ${err.message}`;
      });
      throw new Error(`Validation failed:\n${errorMessages.join("\n")}`);
    }
    throw error;
  }
};
