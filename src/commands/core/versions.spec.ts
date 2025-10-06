/**
 * コアバージョン一覧コマンドのテスト
 */

import { describe, it, expect, vi, beforeEach, afterEach, type MockedFunction } from "vitest";
import { coreVersionsCommand } from "./versions.js";
import { createClient, validateResponse } from "@/utils/api-helpers.js";
import { handleError } from "@/utils/error-handler.js";
import { outputConditional } from "@/utils/output.js";
import { validateArgs } from "@/utils/validation.js";

// モックの設定
vi.mock("@/utils/api-helpers.js", () => ({
  createClient: vi.fn(),
  validateResponse: vi.fn(),
}));

vi.mock("@/utils/error-handler.js", () => ({
  handleError: vi.fn(),
}));

vi.mock("@/utils/output.js", () => ({
  outputConditional: vi.fn(),
}));

vi.mock("@/utils/validation.js", () => ({
  validateArgs: vi.fn(),
  baseUrlSchema: { optional: () => ({}) },
}));

vi.mock("@/logger.js", () => ({
  display: {
    info: vi.fn(),
  },
  log: {
    debug: vi.fn(),
  },
}));

vi.mock("@/i18n/config.js", () => ({
  t: vi.fn((key: string) => key),
}));

describe("coreVersionsCommand", () => {
  const mockClient = {
    GET: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (createClient as MockedFunction<typeof createClient>).mockReturnValue(
      mockClient as unknown as ReturnType<typeof createClient>
    );
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("正常にコアバージョン一覧を取得できる", async () => {
    const mockVersions = ["0.14.0", "0.13.0", "0.12.0"];
    const mockResponse = { data: mockVersions, response: { status: 200 } };

    (validateArgs as MockedFunction<typeof validateArgs>).mockReturnValue({
      baseUrl: "http://localhost:50021",
    } as any);
    mockClient.GET.mockResolvedValue(mockResponse);
    (validateResponse as MockedFunction<typeof validateResponse>).mockReturnValue(
      mockVersions as any
    );

    const args = { baseUrl: "http://localhost:50021", json: false, _: [] };
    await coreVersionsCommand.run?.({ args, rawArgs: [], cmd: coreVersionsCommand });

    expect(validateArgs).toHaveBeenCalledWith(expect.any(Object), args);
    expect(createClient).toHaveBeenCalledWith("http://localhost:50021");
    expect(mockClient.GET).toHaveBeenCalledWith("/core_versions");
    expect(validateResponse).toHaveBeenCalledWith(
      mockResponse,
      "Invalid response format from core versions API",
      { baseUrl: "http://localhost:50021" }
    );
    expect(outputConditional).toHaveBeenCalledWith(
      false,
      mockVersions,
      expect.any(Function)
    );
  });

  it("JSON形式で出力する", async () => {
    const mockVersions = ["0.14.0", "0.13.0"];
    const mockResponse = { data: mockVersions, response: { status: 200 } };

    (validateArgs as MockedFunction<typeof validateArgs>).mockReturnValue({ 
      baseUrl: "http://localhost:50021", 
      json: true 
    } as any);
    mockClient.GET.mockResolvedValue(mockResponse);
    (validateResponse as MockedFunction<typeof validateResponse>).mockReturnValue(
      mockVersions as any
    );

    const args = { baseUrl: "http://localhost:50021", json: true, _: [] };
    await coreVersionsCommand.run?.({ args, rawArgs: [], cmd: coreVersionsCommand });

    expect(outputConditional).toHaveBeenCalledWith(
      true,
      mockVersions,
      expect.any(Function)
    );
  });

  it("エラーが発生した場合にhandleErrorが呼ばれる", async () => {
    const error = new Error("API Error");
    (validateArgs as MockedFunction<typeof validateArgs>).mockImplementation(() => {
      throw error;
    });

    const args = { baseUrl: "http://localhost:50021", json: false, _: [] };
    await coreVersionsCommand.run?.({ args, rawArgs: [], cmd: coreVersionsCommand });

    expect(handleError).toHaveBeenCalledWith(error, "core-versions", {
      baseUrl: "http://localhost:50021",
    });
  });

  it("デフォルトのベースURLが使用される", async () => {
    const mockVersions = ["0.14.0"];
    const mockResponse = { data: mockVersions, response: { status: 200 } };

    (validateArgs as MockedFunction<typeof validateArgs>).mockReturnValue({} as any);
    mockClient.GET.mockResolvedValue(mockResponse);
    (validateResponse as MockedFunction<typeof validateResponse>).mockReturnValue(
      mockVersions as any
    );

    const args = { baseUrl: "http://localhost:50021", json: false, _: [] };
    await coreVersionsCommand.run?.({ args, rawArgs: [], cmd: coreVersionsCommand });

    expect(createClient).toHaveBeenCalledWith(undefined);
  });

  it("配列でないバージョンデータを処理できる", async () => {
    const mockVersions = "0.14.0";
    const mockResponse = { data: mockVersions, response: { status: 200 } };

    (validateArgs as MockedFunction<typeof validateArgs>).mockReturnValue({
      baseUrl: "http://localhost:50021",
    } as any);
    mockClient.GET.mockResolvedValue(mockResponse);
    (validateResponse as MockedFunction<typeof validateResponse>).mockReturnValue(
      mockVersions as any
    );

    const args = { baseUrl: "http://localhost:50021", json: false, _: [] };
    await coreVersionsCommand.run?.({ args, rawArgs: [], cmd: coreVersionsCommand });

    expect(outputConditional).toHaveBeenCalledWith(
      false,
      mockVersions,
      expect.any(Function)
    );
  });
});
