import { readFileSync, writeFileSync } from "node:fs";
import { Result } from "neverthrow";
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

export const parseJson = <T>(content: string, schema: z.ZodType<T>): T => {
  const raw = JSON.parse(content);
  return schema.parse(raw);
};

export const parseJsonResult = <T>(content: string, schema: z.ZodType<T>) =>
  Result.fromThrowable(
    () => JSON.parse(content),
    (e) => e as Error,
  )().andThen((raw) =>
    Result.fromThrowable(
      () => schema.parse(raw),
      (e) => e as Error,
    )(),
  );

export const parseTextLines = (content: string): string[] => {
  return content
    .split("\n")
    .map((line: string) => line.trim())
    .filter((line: string) => line.length > 0);
};

export const saveBuffer = (path: string, data: ArrayBuffer | Buffer): void => {
  const buf = Buffer.isBuffer(data) ? data : Buffer.from(data);
  writeFileSync(path, buf);
};
