/**
 * プリセット関連のバリデーションスキーマ
 *
 * プリセットコマンド（add, update, delete, list）で使用される
 * 共通のZodスキーマを定義します。
 *
 * @module commands/presets/schemas
 */

import { z } from "zod";
import {
  createNonNegativeIntSchema,
  createRangeNumberSchema,
} from "@/utils/number-parser.js";
import { baseUrlSchema } from "@/utils/validation.js";

/**
 * プリセットID検証スキーマ
 */
export const presetIdSchema = createNonNegativeIntSchema("Preset ID");

/**
 * スタイルID検証スキーマ
 */
export const styleIdSchema = createNonNegativeIntSchema("Style ID");

/**
 * スケール値検証スキーマ（0-10の範囲）
 */
export const scaleSchema = createRangeNumberSchema("Scale", 0, 10);

/**
 * 長さ値検証スキーマ（0-10の範囲）
 */
export const lengthSchema = createRangeNumberSchema("Length", 0, 10);

/**
 * プリセット名検証スキーマ
 */
export const presetNameSchema = z
  .string()
  .min(1, "Preset name is required")
  .max(100, "Preset name is too long");

/**
 * 話者UUID検証スキーマ
 */
export const speakerUuidSchema = z.string().uuid("Invalid speaker UUID format");

/**
 * プリセット追加コマンド用のバリデーションスキーマ
 */
export const presetsAddSchema = z.object({
  id: presetIdSchema,
  name: presetNameSchema,
  speaker: speakerUuidSchema,
  style: styleIdSchema,
  speed: scaleSchema,
  pitch: scaleSchema,
  intonation: scaleSchema,
  volume: scaleSchema,
  prePhonemeLength: lengthSchema,
  postPhonemeLength: lengthSchema,
  baseUrl: baseUrlSchema,
  json: z.boolean().optional(),
});

/**
 * プリセット追加コマンドの引数型
 */
export type PresetsAddArgs = z.infer<typeof presetsAddSchema>;

/**
 * プリセット更新コマンド用のバリデーションスキーマ
 */
export const presetsUpdateSchema = z.object({
  id: presetIdSchema,
  name: presetNameSchema.optional(),
  speaker: speakerUuidSchema.optional(),
  style: styleIdSchema.optional(),
  speed: scaleSchema.optional(),
  pitch: scaleSchema.optional(),
  intonation: scaleSchema.optional(),
  volume: scaleSchema.optional(),
  prePhonemeLength: lengthSchema.optional(),
  postPhonemeLength: lengthSchema.optional(),
  baseUrl: baseUrlSchema,
  json: z.boolean().optional(),
});

/**
 * プリセット更新コマンドの引数型
 */
export type PresetsUpdateArgs = z.infer<typeof presetsUpdateSchema>;

/**
 * プリセット削除コマンド用のバリデーションスキーマ
 */
export const presetsDeleteSchema = z.object({
  id: presetIdSchema,
  baseUrl: baseUrlSchema,
  json: z.boolean().optional(),
});

/**
 * プリセット削除コマンドの引数型
 */
export type PresetsDeleteArgs = z.infer<typeof presetsDeleteSchema>;
