/**
 * 数値パーサーユーティリティのテスト
 */

import { describe, expect, it } from "vitest";
import {
  createNonNegativeIntSchema,
  createRangeNumberSchema,
} from "./number-parser.js";

describe("createNonNegativeIntSchema", () => {
  const schema = createNonNegativeIntSchema("testField");

  describe("有効な値", () => {
    it("0を受け入れる", () => {
      expect(schema.parse("0")).toBe(0);
    });

    it("正の整数を受け入れる", () => {
      expect(schema.parse("1")).toBe(1);
      expect(schema.parse("42")).toBe(42);
      expect(schema.parse("999")).toBe(999);
    });

    it("大きな整数を受け入れる", () => {
      expect(schema.parse("1000000")).toBe(1000000);
    });
  });

  describe("無効な値", () => {
    it("負の数を拒否する", () => {
      expect(() => schema.parse("-1")).toThrow(
        "testField must be a non-negative integer",
      );
      expect(() => schema.parse("-42")).toThrow(
        "testField must be a non-negative integer",
      );
    });

    it("小数を拒否する", () => {
      expect(() => schema.parse("1.5")).toThrow(
        "testField must be a non-negative integer",
      );
      expect(() => schema.parse("0.1")).toThrow(
        "testField must be a non-negative integer",
      );
    });

    it("数値でない文字列を拒否する", () => {
      expect(() => schema.parse("abc")).toThrow(
        "testField must be a non-negative integer",
      );
      expect(() => schema.parse("12abc")).toThrow(
        "testField must be a non-negative integer",
      );
    });

    it("NaNを拒否する", () => {
      expect(() => schema.parse("NaN")).toThrow(
        "testField must be a non-negative integer",
      );
    });

    it("Infinityを拒否する", () => {
      expect(() => schema.parse("Infinity")).toThrow(
        "testField must be a non-negative integer",
      );
    });
  });

  describe("カスタムフィールド名", () => {
    it("エラーメッセージに指定したフィールド名を使用する", () => {
      const customSchema = createNonNegativeIntSchema("customField");
      expect(() => customSchema.parse("-1")).toThrow(
        "customField must be a non-negative integer",
      );
    });
  });
});

describe("createRangeNumberSchema", () => {
  const schema = createRangeNumberSchema("testField", 0, 100);

  describe("有効な値", () => {
    it("範囲内の整数を受け入れる", () => {
      expect(schema.parse("0")).toBe(0);
      expect(schema.parse("50")).toBe(50);
      expect(schema.parse("100")).toBe(100);
    });

    it("範囲内の小数を受け入れる", () => {
      expect(schema.parse("0.5")).toBe(0.5);
      expect(schema.parse("99.9")).toBe(99.9);
    });

    it("境界値を受け入れる", () => {
      expect(schema.parse("0")).toBe(0);
      expect(schema.parse("100")).toBe(100);
    });
  });

  describe("無効な値", () => {
    it("範囲外の値を拒否する（小さすぎる）", () => {
      expect(() => schema.parse("-1")).toThrow(
        "testField must be between 0 and 100",
      );
      expect(() => schema.parse("-0.1")).toThrow(
        "testField must be between 0 and 100",
      );
    });

    it("範囲外の値を拒否する（大きすぎる）", () => {
      expect(() => schema.parse("101")).toThrow(
        "testField must be between 0 and 100",
      );
      expect(() => schema.parse("100.1")).toThrow(
        "testField must be between 0 and 100",
      );
    });

    it("数値でない文字列を拒否する", () => {
      expect(() => schema.parse("abc")).toThrow("testField must be a number");
      expect(() => schema.parse("50abc")).toThrow("testField must be a number");
    });

    it("NaNを拒否する", () => {
      expect(() => schema.parse("NaN")).toThrow("testField must be a number");
    });
  });

  describe("異なる範囲", () => {
    it("負の範囲を処理できる", () => {
      const negativeSchema = createRangeNumberSchema("field", -100, -50);
      expect(negativeSchema.parse("-75")).toBe(-75);
      expect(() => negativeSchema.parse("-101")).toThrow(
        "field must be between -100 and -50",
      );
      expect(() => negativeSchema.parse("-49")).toThrow(
        "field must be between -100 and -50",
      );
    });

    it("異なる範囲で正しく動作する", () => {
      const customSchema = createRangeNumberSchema("field", 10, 20);
      expect(customSchema.parse("15")).toBe(15);
      expect(() => customSchema.parse("9")).toThrow(
        "field must be between 10 and 20",
      );
      expect(() => customSchema.parse("21")).toThrow(
        "field must be between 10 and 20",
      );
    });
  });

  describe("カスタムフィールド名とメッセージ", () => {
    it("エラーメッセージに指定したフィールド名を使用する", () => {
      const customSchema = createRangeNumberSchema("customField", 0, 10);
      expect(() => customSchema.parse("abc")).toThrow(
        "customField must be a number",
      );
      expect(() => customSchema.parse("11")).toThrow(
        "customField must be between 0 and 10",
      );
    });
  });
});
