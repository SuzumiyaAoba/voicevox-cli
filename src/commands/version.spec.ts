/**
 * バージョンコマンドのテスト
 */

import { beforeEach, describe, expect, it, vi } from "vitest";
import packageJson from "../../package.json";
import { versionCommand } from "./version.js";

// モックの設定
vi.mock("@/i18n/config.js", () => ({
  t: vi.fn((key: string) => key),
}));

// console.logのモック
const mockConsoleLog = vi.spyOn(console, "log").mockImplementation(() => {});

describe("versionCommand", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("コマンドのメタデータが正しく設定されている", () => {
    expect(versionCommand.meta).toBeDefined();
    expect(
      (versionCommand.meta as unknown as Record<string, unknown>)["name"],
    ).toBe("commands.version.name");
    expect(
      (versionCommand.meta as unknown as Record<string, unknown>)[
        "description"
      ],
    ).toBe("commands.version.description");
  });

  it("引数が空のオブジェクトである", () => {
    expect(versionCommand.args).toEqual({});
  });

  it("バージョン情報を正しく出力する", () => {
    versionCommand.run?.({ args: { _: [] }, rawArgs: [], cmd: versionCommand });

    expect(mockConsoleLog).toHaveBeenCalledWith(
      `${packageJson.name} v${packageJson.version}`,
    );
  });

  it("package.jsonの情報を使用してバージョンを表示する", () => {
    versionCommand.run?.({ args: { _: [] }, rawArgs: [], cmd: versionCommand });

    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringContaining(packageJson.name),
    );
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringContaining(packageJson.version),
    );
  });

  it("引数なしで実行できる", () => {
    expect(() =>
      versionCommand.run?.({
        args: { _: [] },
        rawArgs: [],
        cmd: versionCommand,
      }),
    ).not.toThrow();
  });

  it("引数付きで実行できる（引数は無視される）", () => {
    expect(() =>
      versionCommand.run?.({
        args: { someArg: "value", _: [] },
        rawArgs: [],
        cmd: versionCommand,
      }),
    ).not.toThrow();
  });
});
