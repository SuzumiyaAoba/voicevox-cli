/**
 * 出力ユーティリティのテスト
 */

import { beforeEach, describe, expect, it, vi } from "vitest";
import { display } from "@/logger.js";
import {
  outputConditional,
  outputJson,
  resolveOutputFormat,
} from "./output.js";

// モックの設定
vi.mock("@/logger.js", () => ({
  display: {
    info: vi.fn(),
  },
}));

describe("outputJson", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("オブジェクトをJSON形式で出力する", () => {
    const data = { name: "test", value: 123 };
    outputJson(data);

    expect(display.info).toHaveBeenCalledWith(JSON.stringify(data, null, 2));
  });

  it("配列をJSON形式で出力する", () => {
    const data = [1, 2, 3, { nested: "value" }];
    outputJson(data);

    expect(display.info).toHaveBeenCalledWith(JSON.stringify(data, null, 2));
  });

  it("プリミティブ値をJSON形式で出力する", () => {
    const data = "simple string";
    outputJson(data);

    expect(display.info).toHaveBeenCalledWith(JSON.stringify(data, null, 2));
  });

  it("null値をJSON形式で出力する", () => {
    const data = null;
    outputJson(data);

    expect(display.info).toHaveBeenCalledWith(JSON.stringify(data, null, 2));
  });

  it("undefined値をJSON形式で出力する", () => {
    const data = undefined;
    outputJson(data);

    expect(display.info).toHaveBeenCalledWith(JSON.stringify(data, null, 2));
  });
});

describe("outputConditional", () => {
  const mockTextFormatter = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("条件がtrueの場合、JSON形式で出力する", () => {
    const data = { test: "value" };
    outputConditional(true, data, mockTextFormatter);

    expect(display.info).toHaveBeenCalledWith(JSON.stringify(data, null, 2));
    expect(mockTextFormatter).not.toHaveBeenCalled();
  });

  it("条件がfalseの場合、テキストフォーマッターを呼ぶ", () => {
    const data = { test: "value" };
    outputConditional(false, data, mockTextFormatter);

    expect(mockTextFormatter).toHaveBeenCalled();
    expect(display.info).not.toHaveBeenCalled();
  });

  it("条件がfalseの場合、データは使用されない", () => {
    const data = { test: "value" };
    outputConditional(false, data, mockTextFormatter);

    expect(mockTextFormatter).toHaveBeenCalledWith();
  });

  it("複雑なデータ構造をJSON形式で出力する", () => {
    const data = {
      users: [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
      ],
      metadata: {
        total: 2,
        page: 1,
      },
    };
    outputConditional(true, data, mockTextFormatter);

    expect(display.info).toHaveBeenCalledWith(JSON.stringify(data, null, 2));
  });
});

describe("resolveOutputFormat", () => {
  it("typeが指定されている場合、typeを返す", () => {
    expect(resolveOutputFormat("json", true)).toBe("json");
    expect(resolveOutputFormat("text", true)).toBe("text");
    expect(resolveOutputFormat("json", false)).toBe("json");
    expect(resolveOutputFormat("text", false)).toBe("text");
  });

  it("typeが指定されていない場合、jsonフラグに基づいて決定する", () => {
    expect(resolveOutputFormat(undefined, true)).toBe("json");
    expect(resolveOutputFormat(undefined, false)).toBe("text");
  });

  it("両方が指定されていない場合、textを返す", () => {
    expect(resolveOutputFormat(undefined, undefined)).toBe("text");
  });

  it("typeがundefined、jsonがfalseの場合、textを返す", () => {
    expect(resolveOutputFormat(undefined, false)).toBe("text");
  });

  it("typeがundefined、jsonがtrueの場合、jsonを返す", () => {
    expect(resolveOutputFormat(undefined, true)).toBe("json");
  });
});
