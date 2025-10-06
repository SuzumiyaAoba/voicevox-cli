/**
 * バリデーションユーティリティのテスト
 */

import { describe, it, expect } from "vitest";
import { z } from "zod";
import {
  baseUrlSchema,
  speakerIdSchema,
  textSchema,
  outputFileSchema,
  inputFileSchema,
  outputTypeSchema,
  validateArgs,
} from "./validation.js";

describe("validation schemas", () => {
  describe("baseUrlSchema", () => {
    it("有効なURLを受け入れる", () => {
      expect(() => baseUrlSchema.parse("http://localhost:50021")).not.toThrow();
      expect(() => baseUrlSchema.parse("https://api.example.com")).not.toThrow();
      expect(() => baseUrlSchema.parse("http://192.168.1.1:8080")).not.toThrow();
    });

    it("無効なURLを拒否する", () => {
      expect(() => baseUrlSchema.parse("invalid-url")).toThrow();
      expect(() => baseUrlSchema.parse("")).toThrow();
      expect(() => baseUrlSchema.parse("not-a-url")).toThrow();
    });
  });

  describe("speakerIdSchema", () => {
    it("有効な話者IDを受け入れる", () => {
      expect(() => speakerIdSchema.parse("1")).not.toThrow();
      expect(() => speakerIdSchema.parse("speaker-123")).not.toThrow();
      expect(() => speakerIdSchema.parse("a")).not.toThrow();
    });

    it("空の文字列を拒否する", () => {
      expect(() => speakerIdSchema.parse("")).toThrow();
    });
  });

  describe("textSchema", () => {
    it("有効なテキストを受け入れる", () => {
      expect(() => textSchema.parse("Hello")).not.toThrow();
      expect(() => textSchema.parse("こんにちは")).not.toThrow();
      expect(() => textSchema.parse("a".repeat(1000))).not.toThrow();
    });

    it("空の文字列を拒否する", () => {
      expect(() => textSchema.parse("")).toThrow();
    });

    it("長すぎるテキストを拒否する", () => {
      expect(() => textSchema.parse("a".repeat(1001))).toThrow();
    });
  });

  describe("outputFileSchema", () => {
    it("有効なファイルパスを受け入れる", () => {
      expect(() => outputFileSchema.parse("output.wav")).not.toThrow();
      expect(() => outputFileSchema.parse("/path/to/file.wav")).not.toThrow();
      expect(() => outputFileSchema.parse("./output.wav")).not.toThrow();
    });

    it("空の文字列を拒否する", () => {
      expect(() => outputFileSchema.parse("")).toThrow();
    });
  });

  describe("inputFileSchema", () => {
    it("有効なファイルパスを受け入れる", () => {
      expect(() => inputFileSchema.parse("input.txt")).not.toThrow();
      expect(() => inputFileSchema.parse("/path/to/input.txt")).not.toThrow();
    });

    it("空の文字列を拒否する", () => {
      expect(() => inputFileSchema.parse("")).toThrow();
    });
  });

  describe("outputTypeSchema", () => {
    it("有効な出力タイプを受け入れる", () => {
      expect(() => outputTypeSchema.parse("json")).not.toThrow();
      expect(() => outputTypeSchema.parse("text")).not.toThrow();
    });

    it("無効な出力タイプを拒否する", () => {
      expect(() => outputTypeSchema.parse("xml")).toThrow();
      expect(() => outputTypeSchema.parse("invalid")).toThrow();
    });
  });
});

describe("validateArgs", () => {
  const testSchema = z.object({
    name: z.string(),
    age: z.number(),
    email: z.string().email(),
  });

  it("有効な引数を正常に処理する", () => {
    const validArgs = {
      name: "John Doe",
      age: 30,
      email: "john@example.com",
    };

    const result = validateArgs(testSchema, validArgs);
    expect(result).toEqual(validArgs);
  });

  it("無効な引数でエラーを投げる", () => {
    const invalidArgs = {
      name: "John Doe",
      age: "30", // 数値でない
      email: "invalid-email", // 有効なメールアドレスでない
    };

    expect(() => validateArgs(testSchema, invalidArgs)).toThrow("Validation failed:");
  });

  it("複数のバリデーションエラーを適切に処理する", () => {
    const invalidArgs = {
      name: "", // 空の文字列
      age: -1, // 負の数
      email: "invalid", // 無効なメール
    };

    expect(() => validateArgs(testSchema, invalidArgs)).toThrow("Validation failed:");
  });

  it("ZodError以外のエラーを再投げする", () => {
    const schema = z.object({
      value: z.string().transform(() => {
        throw new Error("Transform error");
      }),
    });

    expect(() => validateArgs(schema, { value: "test" })).toThrow("Transform error");
  });

  it("ネストしたオブジェクトのバリデーションエラーを適切に処理する", () => {
    const nestedSchema = z.object({
      user: z.object({
        name: z.string(),
        profile: z.object({
          age: z.number(),
        }),
      }),
    });

    const invalidArgs = {
      user: {
        name: "",
        profile: {
          age: "invalid",
        },
      },
    };

    expect(() => validateArgs(nestedSchema, invalidArgs)).toThrow("Validation failed:");
  });
});
