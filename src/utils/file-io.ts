/**
 * ファイル入出力ユーティリティ
 *
 * ファイルの読み書き、JSON解析、テキスト処理などの機能を提供します。
 * Result型を使用したエラーハンドリングもサポートしています。
 *
 * @module file-io
 */

import { readFileSync, writeFileSync } from "node:fs";
import { Result } from "neverthrow";
import type { z } from "zod";

/**
 * ファイルをUTF-8形式で読み込む
 *
 * @param path - 読み込むファイルのパス
 * @returns ファイルの内容（文字列）
 * @throws ファイルが存在しない場合や読み込みに失敗した場合
 */
export const readFileUtf8 = (path: string): string => {
  return readFileSync(path, "utf-8");
};

/**
 * JSON文字列を安全にパースしてZodスキーマで検証する
 *
 * パースや検証に失敗した場合はundefinedを返します（例外を投げません）。
 *
 * @param content - パースするJSON文字列
 * @param schema - 検証に使用するZodスキーマ
 * @returns パースと検証に成功した場合はデータ、失敗した場合はundefined
 */
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

/**
 * JSON文字列をパースしてZodスキーマで検証する
 *
 * パースや検証に失敗した場合は例外を投げます。
 *
 * @param content - パースするJSON文字列
 * @param schema - 検証に使用するZodスキーマ
 * @returns パースと検証に成功したデータ
 * @throws JSON.parseエラーまたはZodバリデーションエラー
 */
export const parseJson = <T>(content: string, schema: z.ZodType<T>): T => {
  const raw = JSON.parse(content);
  return schema.parse(raw);
};

/**
 * JSON文字列をパースしてZodスキーマで検証し、Result型で返す
 *
 * neverthrowのResult型を使用してエラーハンドリングを行います。
 *
 * @param content - パースするJSON文字列
 * @param schema - 検証に使用するZodスキーマ
 * @returns Result型（成功時はデータ、失敗時はError）
 */
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

/**
 * テキストを行ごとに分割し、空行を除外する
 *
 * 各行はトリムされ、空行（空白のみの行を含む）は除外されます。
 *
 * @param content - 分割するテキスト
 * @returns 空でない行の配列
 */
export const parseTextLines = (content: string): string[] => {
  return content
    .split("\n")
    .map((line: string) => line.trim())
    .filter((line: string) => line.length > 0);
};

/**
 * バイナリデータをファイルに保存する
 *
 * ArrayBufferまたはBufferを受け取り、ファイルに書き込みます。
 *
 * @param path - 保存先のファイルパス
 * @param data - 保存するバイナリデータ
 * @throws 書き込みに失敗した場合
 */
export const saveBuffer = (path: string, data: ArrayBuffer | Buffer): void => {
  const buf = Buffer.isBuffer(data) ? data : Buffer.from(data);
  writeFileSync(path, buf);
};
