/**
 * コマンドヘルパーのテスト
 */

import { describe, expect, it, vi } from "vitest";
import { t } from "@/i18n/config.js";
import {
  baseUrlOption,
  type CommandArgs,
  commonCommandOptions,
} from "./command-helpers.js";

// モックの設定
vi.mock("@/i18n/config.js", () => ({
  t: vi.fn((key: string) => key),
}));

describe("baseUrlOption", () => {
  it("正しい構造を持つ", () => {
    expect(baseUrlOption).toHaveProperty("baseUrl");
    expect(baseUrlOption.baseUrl).toHaveProperty("type", "string");
    expect(baseUrlOption.baseUrl).toHaveProperty("description");
    expect(baseUrlOption.baseUrl).toHaveProperty(
      "default",
      "http://localhost:50021",
    );
  });

  it("デフォルト値が正しく設定されている", () => {
    expect(baseUrlOption.baseUrl.default).toBe("http://localhost:50021");
  });

  it("型が正しく設定されている", () => {
    expect(baseUrlOption.baseUrl.type).toBe("string");
  });
});

describe("commonCommandOptions", () => {
  it("jsonオプションが含まれている", () => {
    expect(commonCommandOptions).toHaveProperty("json");
    expect(commonCommandOptions.json).toHaveProperty("type", "boolean");
    expect(commonCommandOptions.json).toHaveProperty("alias", "j");
  });

  it("baseUrlオプションが含まれている", () => {
    expect(commonCommandOptions).toHaveProperty("baseUrl");
    expect(commonCommandOptions.baseUrl).toHaveProperty("type", "string");
  });

  it("jsonオプションのエイリアスが正しく設定されている", () => {
    expect(commonCommandOptions.json.alias).toBe("j");
  });

  it("jsonオプションの型が正しく設定されている", () => {
    expect(commonCommandOptions.json.type).toBe("boolean");
  });

  it("baseUrlオプションのデフォルト値が正しく設定されている", () => {
    expect(commonCommandOptions.baseUrl.default).toBe("http://localhost:50021");
  });
});

describe("CommandArgs型", () => {
  it("commonCommandOptionsの型と一致する", () => {
    // 型の互換性をテストするため、実際の値を使用
    const testArgs: CommandArgs = {
      json: {
        type: "boolean",
        description: "test",
        alias: "j",
      },
      baseUrl: {
        type: "string",
        description:
          "VOICEVOX Engine base URL (default: http://localhost:50021)",
        default: "http://localhost:50021",
      },
    };

    expect(testArgs).toBeDefined();
    expect(testArgs.json.type).toBe("boolean");
    expect(testArgs.baseUrl.type).toBe("string");
  });
});

describe("i18n統合", () => {
  it("t関数が呼ばれる", () => {
    // commonCommandOptionsが定義される際にt関数が呼ばれることを確認
    expect(t).toHaveBeenCalledWith("common.args.json");
  });

  it("t関数が正しいキーで呼ばれる", () => {
    expect(t).toHaveBeenCalledWith("common.args.json");
  });
});
