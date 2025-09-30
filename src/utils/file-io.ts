import { readFileSync, writeFileSync } from "node:fs";
import type { z } from "zod";

export const readFileUtf8 = (path: string): string => {
  return readFileSync(path, "utf-8");
};

export const parseJsonSafe = <T>(
  content: string,
  schema: z.ZodType<T>,
): T | undefined => {
  try {
    const raw = JSON.parse(content);
    const result = schema.safeParse(raw);
    return result.success ? result.data : undefined;
  } catch {
    return undefined;
  }
};

export const parseJsonArray = <T>(
  content: string,
  schema: z.ZodType<T>,
): T[] => {
  const raw = JSON.parse(content);
  if (!Array.isArray(raw)) throw new Error("Expected JSON array");
  return raw.map((item) => schema.parse(item));
};

export const parseJsonObject = <T>(
  content: string,
  schema: z.ZodType<T>,
): T => {
  const raw = JSON.parse(content);
  return schema.parse(raw);
};

export const parseTextLines = (content: string): string[] => {
  return content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
};

export const saveBuffer = (path: string, data: ArrayBuffer | Buffer): void => {
  const buf = Buffer.isBuffer(data) ? data : Buffer.from(data);
  writeFileSync(path, buf);
};
