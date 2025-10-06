/**
 * コア関連コマンドのテスト
 */

import { describe, expect, it, vi } from "vitest";
import { coreCommand } from "./index.js";

vi.mock("@/i18n/config.js", () => ({
  t: vi.fn((key: string) => key),
}));

vi.mock("./versions.js", () => ({
  coreVersionsCommand: {
    meta: {
      name: "versions",
      description: "List core versions",
    },
  },
}));

describe("coreCommand", () => {
  it("コマンドのメタデータが正しく設定されている", () => {
    expect(coreCommand.meta).toBeDefined();
    expect(
      (coreCommand.meta as Record<"name" | "description", unknown>).name,
    ).toBe("commands.core.name");
    expect(
      (coreCommand.meta as Record<"name" | "description", unknown>).description,
    ).toBe("commands.core.description");
  });

  it("versionsサブコマンドが正しく設定されている", () => {
    expect(coreCommand.subCommands).toBeDefined();
    expect(
      (coreCommand.subCommands as Record<"versions", unknown>).versions,
    ).toBeDefined();
  });

  it("サブコマンドの構造が正しい", () => {
    const subCommands = coreCommand.subCommands as Record<"versions", unknown>;
    expect(subCommands).toHaveProperty("versions");
    expect(subCommands.versions).toBeDefined();
  });
});
