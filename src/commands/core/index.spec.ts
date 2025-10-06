/**
 * コア関連コマンドのテスト
 */

import { describe, it, expect, vi } from "vitest";
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
    expect((coreCommand as any).meta.name).toBe("commands.core.name");
    expect((coreCommand as any).meta.description).toBe("commands.core.description");
  });

  it("versionsサブコマンドが正しく設定されている", () => {
    expect(coreCommand.subCommands).toBeDefined();
    expect((coreCommand as any).subCommands.versions).toBeDefined();
  });

  it("サブコマンドの構造が正しい", () => {
    const subCommands = (coreCommand as any).subCommands;
    expect(subCommands).toHaveProperty("versions");
    expect(subCommands?.versions).toHaveProperty("meta");
  });
});
