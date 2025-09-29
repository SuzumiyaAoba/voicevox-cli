import type { paths } from "@suzumiyaaoba/voicevox-client";
import { z } from "zod";

// API型定義
export type AudioQuery =
  paths["/audio_query"]["post"]["responses"]["200"]["content"]["application/json"];

// AudioQueryのZodスキーマ
export const audioQueryDataSchema = z.object({
  accent_phrases: z.array(
    z.object({
      moras: z.array(
        z.object({
          text: z.string(),
          consonant: z.string().optional(),
          consonant_length: z.number().optional(),
          vowel: z.string(),
          vowel_length: z.number(),
          pitch: z.number(),
        }),
      ),
      accent: z.number(),
      pause_mora: z
        .object({
          text: z.string(),
          consonant: z.string().optional(),
          consonant_length: z.number().optional(),
          vowel: z.string(),
          vowel_length: z.number(),
          pitch: z.number(),
        })
        .optional(),
      is_interrogative: z.boolean(),
    }),
  ),
  speedScale: z.number(),
  pitchScale: z.number(),
  intonationScale: z.number(),
  volumeScale: z.number(),
  prePhonemeLength: z.number(),
  postPhonemeLength: z.number(),
  pauseLength: z.number().optional(),
  pauseLengthScale: z.number(),
  outputSamplingRate: z.number(),
  outputStereo: z.boolean(),
  kana: z.string().optional(),
});

// 共通のバリデーションスキーマ
export const baseUrlSchema = z.string().url("Invalid base URL format");

export const speakerIdSchema = z.string().min(1, "Speaker ID is required");

export const textSchema = z
  .string()
  .min(1, "Text is required")
  .max(1000, "Text is too long");

export const outputFileSchema = z
  .string()
  .min(1, "Output file path is required");

export const inputFileSchema = z
  .string()
  .min(1, "Input file path is required")
  .refine((val) => val.endsWith(".json"), {
    message: "Input file must be a JSON file",
  });

// プリセット関連のスキーマ
export const presetIdSchema = z.string().transform((val) => {
  const num = Number(val);
  if (Number.isNaN(num) || num < 0) {
    throw new Error("Preset ID must be a non-negative number");
  }
  return num;
});

export const presetNameSchema = z
  .string()
  .min(1, "Preset name is required")
  .max(100, "Preset name is too long");

export const speakerUuidSchema = z.string().uuid("Invalid speaker UUID format");

export const styleIdSchema = z.string().transform((val) => {
  const num = Number(val);
  if (Number.isNaN(num) || num < 0) {
    throw new Error("Style ID must be a non-negative number");
  }
  return num;
});

export const scaleSchema = z.string().transform((val) => {
  const num = Number(val);
  if (Number.isNaN(num)) {
    throw new Error("Scale value must be a number");
  }
  if (num < 0 || num > 10) {
    throw new Error("Scale value must be between 0 and 10");
  }
  return num;
});

export const lengthSchema = z.string().transform((val) => {
  const num = Number(val);
  if (Number.isNaN(num)) {
    throw new Error("Length value must be a number");
  }
  if (num < 0 || num > 10) {
    throw new Error("Length value must be between 0 and 10");
  }
  return num;
});

// プリセット追加用のスキーマ
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

// プリセット更新用のスキーマ
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

// プリセット削除用のスキーマ
export const presetsDeleteSchema = z.object({
  id: presetIdSchema,
  baseUrl: baseUrlSchema,
  json: z.boolean().optional(),
});

// 出力形式のスキーマ（文字列からパース）
export const outputTypeSchema = z.union([z.literal("json"), z.literal("text")]);

// 音声合成用のスキーマ
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
  .transform((data) => {
    // text が undefined の場合は空文字列に変換（実際には refine でチェック済み）
    return {
      ...data,
      text: data.text ?? "",
    };
  });

// 音声クエリ用のスキーマ
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

// スピーカー一覧用のスキーマ
export const speakersSchema = z.object({
  baseUrl: baseUrlSchema.optional(),
  json: z.boolean().optional(),
});

// プリセット一覧用のスキーマ
export const presetsListSchema = z.object({
  baseUrl: baseUrlSchema.optional(),
  json: z.boolean().optional(),
});

// バージョン用のスキーマ
export const versionSchema = z.object({
  baseUrl: baseUrlSchema.optional(),
  json: z.boolean().optional(),
});

// エンジンバージョン用のスキーマ
export const engineVersionSchema = z.object({
  baseUrl: baseUrlSchema.optional(),
  json: z.boolean().optional(),
});

// コアバージョン一覧用のスキーマ
export const engineVersionsSchema = z.object({
  baseUrl: baseUrlSchema.optional(),
  json: z.boolean().optional(),
});

// バリデーション関数
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
