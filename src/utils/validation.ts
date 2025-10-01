import type { components } from "@suzumiyaaoba/voicevox-client";
import { z } from "zod";
import {
  createNonNegativeIntSchema,
  createRangeNumberSchema,
} from "./number-parser.js";

// ========================================
// API型定義
// ========================================

export type AudioQuery = components["schemas"]["AudioQuery"];

// ========================================
// 共通の基本スキーマ
// ========================================

export const baseUrlSchema = z.string().url("Invalid base URL format");

export const speakerIdSchema = z.string().min(1, "Speaker ID is required");

export const textSchema = z
  .string()
  .min(1, "Text is required")
  .max(1000, "Text is too long");

export const outputFileSchema = z
  .string()
  .min(1, "Output file path is required");

export const inputFileSchema = z.string().min(1, "Input file path is required");

export const outputTypeSchema = z.union([z.literal("json"), z.literal("text")]);

// ========================================
// 数値関連のスキーマ（共通ヘルパーを使用）
// ========================================

export const presetIdSchema = createNonNegativeIntSchema("Preset ID");

export const styleIdSchema = createNonNegativeIntSchema("Style ID");

export const scaleSchema = createRangeNumberSchema("Scale", 0, 10);

export const lengthSchema = createRangeNumberSchema("Length", 0, 10);

// ========================================
// その他の特定スキーマ
// ========================================

export const presetNameSchema = z
  .string()
  .min(1, "Preset name is required")
  .max(100, "Preset name is too long");

export const speakerUuidSchema = z.string().uuid("Invalid speaker UUID format");

// ========================================
// AudioQuery関連のスキーマ
// ========================================

// Moraのスキーマ
const moraSchema: z.ZodType<components["schemas"]["Mora"]> = z.object({
  text: z.string(),
  consonant: z.string().optional(),
  consonant_length: z.number().optional(),
  vowel: z.string(),
  vowel_length: z.number(),
  pitch: z.number(),
});

// AccentPhraseのスキーマ
const accentPhraseSchema: z.ZodType<components["schemas"]["AccentPhrase"]> =
  z.object({
    moras: z.array(moraSchema),
    accent: z.number(),
    pause_mora: moraSchema.optional(),
    is_interrogative: z.boolean(),
  });

// AudioQueryのZodスキーマ
export const audioQueryDataSchema: z.ZodType<AudioQuery> = z.object({
  accent_phrases: z.array(accentPhraseSchema),
  speedScale: z.number(),
  pitchScale: z.number(),
  intonationScale: z.number(),
  volumeScale: z.number(),
  prePhonemeLength: z.number(),
  postPhonemeLength: z.number(),
  pauseLength: z.number().nullable().optional(),
  pauseLengthScale: z.number(),
  outputSamplingRate: z.number(),
  outputStereo: z.boolean(),
  kana: z.string().optional(),
});

// ========================================
// 共通のコマンドオプションスキーマ
// ========================================

/**
 * 基本的なコマンドオプション（baseUrl, jsonオプション）
 */
const baseCommandOptionsSchema = z.object({
  baseUrl: baseUrlSchema.optional(),
  json: z.boolean().optional(),
});

// ========================================
// コマンド用スキーマ
// ========================================

// --- Synthesis Command ---
export const synthesisSchema = z
  .object({
    speaker: speakerIdSchema,
    text: textSchema.optional(),
    input: inputFileSchema.optional(),
    output: outputFileSchema.optional(),
    play: z.boolean().optional(),
    type: outputTypeSchema.optional(),
    baseUrl: baseUrlSchema,
    json: z.boolean().optional(),
    multi: z.boolean().optional(),
  })
  .refine(
    (data) => {
      // text または input のいずれかが必須
      return data.text !== undefined || data.input !== undefined;
    },
    {
      message: "Either text or input file must be provided",
      path: ["text", "input"],
    },
  )
  .refine(
    (data) => {
      // type と json は同時に指定できない
      return !(data.type !== undefined && data.json !== undefined);
    },
    {
      message: "Cannot specify both type and json options",
      path: ["type", "json"],
    },
  )
  .refine(
    (data) => {
      // multi は input と一緒にのみ使用可能
      if (data.multi && !data.input) {
        return false;
      }
      return true;
    },
    {
      message: "Multi mode requires input file",
      path: ["multi"],
    },
  )
  .transform((data) => {
    // text が undefined の場合は空文字列に変換（実際には refine でチェック済み）
    return {
      ...data,
      text: data.text ?? "",
    };
  });
export type SynthesisArgs = z.infer<typeof synthesisSchema>;

// --- Audio Query Command ---
export const audioQuerySchema = z
  .object({
    speaker: speakerIdSchema.optional(),
    presetId: presetIdSchema.optional(),
    text: textSchema,
    baseUrl: baseUrlSchema,
    json: z.boolean().optional(),
    enableKatakanaEnglish: z.boolean().optional(),
  })
  .superRefine((val, ctx) => {
    const hasSpeaker =
      typeof val.speaker === "string" && val.speaker.length > 0;
    const hasPreset = typeof val.presetId === "number";
    if (!hasSpeaker && !hasPreset) {
      ctx.addIssue({
        code: "custom",
        message: "Either speaker or presetId is required",
        path: ["presetId"],
      });
    }
  });
export type AudioQueryArgs = z.infer<typeof audioQuerySchema>;

// --- Presets Commands ---
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
export type PresetsAddArgs = z.infer<typeof presetsAddSchema>;

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
export type PresetsUpdateArgs = z.infer<typeof presetsUpdateSchema>;

export const presetsDeleteSchema = z.object({
  id: presetIdSchema,
  baseUrl: baseUrlSchema,
  json: z.boolean().optional(),
});
export type PresetsDeleteArgs = z.infer<typeof presetsDeleteSchema>;

export const presetsListSchema = baseCommandOptionsSchema;
export type PresetsListArgs = z.infer<typeof presetsListSchema>;

// --- Speakers Command ---
export const speakersSchema = baseCommandOptionsSchema;
export type SpeakersArgs = z.infer<typeof speakersSchema>;

// --- Version Commands ---
export const versionSchema = baseCommandOptionsSchema;
export type VersionArgs = z.infer<typeof versionSchema>;

export const engineVersionSchema = baseCommandOptionsSchema;
export type EngineVersionArgs = z.infer<typeof engineVersionSchema>;

export const engineVersionsSchema = baseCommandOptionsSchema;
export type EngineVersionsArgs = z.infer<typeof engineVersionsSchema>;

// ========================================
// バリデーションヘルパー
// ========================================

/**
 * Zodスキーマを使用して引数をバリデーションする
 * @param schema - Zodスキーマ
 * @param args - バリデーション対象の引数
 * @returns バリデーション済みの引数
 * @throws バリデーションエラー
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
