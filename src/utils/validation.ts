import { z } from "zod";

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

// 音声合成用のスキーマ
export const synthesisSchema = z.object({
  speaker: speakerIdSchema,
  text: textSchema,
  output: outputFileSchema.optional(),
  play: z.boolean().optional(),
  baseUrl: baseUrlSchema,
  json: z.boolean().optional(),
});

// 音声クエリ用のスキーマ
export const audioQuerySchema = z.object({
  speaker: speakerIdSchema,
  text: textSchema,
  baseUrl: baseUrlSchema,
  json: z.boolean().optional(),
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
