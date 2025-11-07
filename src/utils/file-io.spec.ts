/**
 * ファイル入出力ユーティリティのテスト
 */

import { readFileSync, writeFileSync } from "node:fs";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import {
  parseJson,
  parseJsonResult,
  parseJsonSafe,
  parseTextLines,
  readFileUtf8,
  saveBuffer,
} from "./file-io.js";

// モックの設定
vi.mock("node:fs", () => ({
  readFileSync: vi.fn(),
  writeFileSync: vi.fn(),
}));

describe("readFileUtf8", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("ファイルをUTF-8形式で読み込む", () => {
    const mockContent = "Test content";
    vi.mocked(readFileSync).mockReturnValue(mockContent);

    const result = readFileUtf8("/test/path.txt");

    expect(readFileSync).toHaveBeenCalledWith("/test/path.txt", "utf-8");
    expect(result).toBe(mockContent);
  });

  it("日本語コンテンツを正しく読み込む", () => {
    const mockContent = "こんにちは、世界";
    vi.mocked(readFileSync).mockReturnValue(mockContent);

    const result = readFileUtf8("/test/japanese.txt");

    expect(result).toBe(mockContent);
  });
});

describe("parseJsonSafe", () => {
  const testSchema = z.object({
    name: z.string(),
    age: z.number(),
  });

  it("有効なJSONをパースして検証する", () => {
    const json = '{"name": "Alice", "age": 30}';
    const result = parseJsonSafe(json, testSchema);

    expect(result).toEqual({ name: "Alice", age: 30 });
  });

  it("無効なJSONに対してundefinedを返す", () => {
    const json = "invalid json";
    const result = parseJsonSafe(json, testSchema);

    expect(result).toBeUndefined();
  });

  it("スキーマに合わないデータに対してundefinedを返す", () => {
    const json = '{"name": "Alice", "age": "thirty"}';
    const result = parseJsonSafe(json, testSchema);

    expect(result).toBeUndefined();
  });

  it("空のオブジェクトがスキーマに合わない場合undefinedを返す", () => {
    const json = "{}";
    const result = parseJsonSafe(json, testSchema);

    expect(result).toBeUndefined();
  });

  it("配列のJSONをパースできる", () => {
    const arraySchema = z.array(z.number());
    const json = "[1, 2, 3, 4]";
    const result = parseJsonSafe(json, arraySchema);

    expect(result).toEqual([1, 2, 3, 4]);
  });

  it("ネストしたオブジェクトをパースできる", () => {
    const nestedSchema = z.object({
      user: z.object({
        name: z.string(),
        age: z.number(),
      }),
    });
    const json = '{"user": {"name": "Bob", "age": 25}}';
    const result = parseJsonSafe(json, nestedSchema);

    expect(result).toEqual({ user: { name: "Bob", age: 25 } });
  });
});

describe("parseJson", () => {
  const testSchema = z.object({
    name: z.string(),
    age: z.number(),
  });

  it("有効なJSONをパースして検証する", () => {
    const json = '{"name": "Alice", "age": 30}';
    const result = parseJson(json, testSchema);

    expect(result).toEqual({ name: "Alice", age: 30 });
  });

  it("無効なJSONに対してエラーを投げる", () => {
    const json = "invalid json";

    expect(() => parseJson(json, testSchema)).toThrow();
  });

  it("スキーマに合わないデータに対してエラーを投げる", () => {
    const json = '{"name": "Alice", "age": "thirty"}';

    expect(() => parseJson(json, testSchema)).toThrow();
  });

  it("配列のJSONをパースできる", () => {
    const arraySchema = z.array(z.number());
    const json = "[1, 2, 3, 4]";
    const result = parseJson(json, arraySchema);

    expect(result).toEqual([1, 2, 3, 4]);
  });
});

describe("parseJsonResult", () => {
  const testSchema = z.object({
    name: z.string(),
    age: z.number(),
  });

  it("有効なJSONをパースして成功のResultを返す", () => {
    const json = '{"name": "Alice", "age": 30}';
    const result = parseJsonResult(json, testSchema);

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toEqual({ name: "Alice", age: 30 });
    }
  });

  it("無効なJSONに対して失敗のResultを返す", () => {
    const json = "invalid json";
    const result = parseJsonResult(json, testSchema);

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(Error);
    }
  });

  it("スキーマに合わないデータに対して失敗のResultを返す", () => {
    const json = '{"name": "Alice", "age": "thirty"}';
    const result = parseJsonResult(json, testSchema);

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(Error);
    }
  });

  it("有効な配列のJSONをパースできる", () => {
    const arraySchema = z.array(z.number());
    const json = "[1, 2, 3, 4]";
    const result = parseJsonResult(json, arraySchema);

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toEqual([1, 2, 3, 4]);
    }
  });
});

describe("parseTextLines", () => {
  it("テキストを行に分割する", () => {
    const text = "line1\nline2\nline3";
    const result = parseTextLines(text);

    expect(result).toEqual(["line1", "line2", "line3"]);
  });

  it("空行を除外する", () => {
    const text = "line1\n\nline2\n\nline3";
    const result = parseTextLines(text);

    expect(result).toEqual(["line1", "line2", "line3"]);
  });

  it("各行をトリムする", () => {
    const text = "  line1  \n  line2  \n  line3  ";
    const result = parseTextLines(text);

    expect(result).toEqual(["line1", "line2", "line3"]);
  });

  it("空白のみの行を除外する", () => {
    const text = "line1\n   \nline2\n\t\t\nline3";
    const result = parseTextLines(text);

    expect(result).toEqual(["line1", "line2", "line3"]);
  });

  it("単一行のテキストを処理する", () => {
    const text = "single line";
    const result = parseTextLines(text);

    expect(result).toEqual(["single line"]);
  });

  it("空のテキストに対して空配列を返す", () => {
    const text = "";
    const result = parseTextLines(text);

    expect(result).toEqual([]);
  });

  it("改行のみのテキストに対して空配列を返す", () => {
    const text = "\n\n\n";
    const result = parseTextLines(text);

    expect(result).toEqual([]);
  });

  it("日本語テキストを処理できる", () => {
    const text = "こんにちは\nさようなら\nありがとう";
    const result = parseTextLines(text);

    expect(result).toEqual(["こんにちは", "さようなら", "ありがとう"]);
  });
});

describe("saveBuffer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Bufferをファイルに保存する", () => {
    const buffer = Buffer.from("test data");
    saveBuffer("/test/output.bin", buffer);

    expect(writeFileSync).toHaveBeenCalledWith("/test/output.bin", buffer);
  });

  it("ArrayBufferをファイルに保存する", () => {
    const arrayBuffer = new ArrayBuffer(10);
    saveBuffer("/test/output.bin", arrayBuffer);

    expect(writeFileSync).toHaveBeenCalledWith(
      "/test/output.bin",
      expect.any(Buffer),
    );
  });

  it("空のBufferを保存できる", () => {
    const buffer = Buffer.from("");
    saveBuffer("/test/empty.bin", buffer);

    expect(writeFileSync).toHaveBeenCalledWith("/test/empty.bin", buffer);
  });

  it("大きなArrayBufferを保存できる", () => {
    const arrayBuffer = new ArrayBuffer(1024 * 1024); // 1MB
    saveBuffer("/test/large.bin", arrayBuffer);

    expect(writeFileSync).toHaveBeenCalledWith(
      "/test/large.bin",
      expect.any(Buffer),
    );
  });
});
