/**
 * 話者一覧コマンドのテスト
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createClient, validateResponse } from "@/utils/api-helpers.js";
import { createTable } from "@/utils/display.js";
import { handleError } from "@/utils/error-handler.js";
import { outputConditional } from "@/utils/output.js";
import { speakersCommand } from "./speakers.js";

// モックの設定
vi.mock("@/utils/api-helpers.js", () => ({
  createClient: vi.fn(),
  validateResponse: vi.fn(),
}));

vi.mock("@/utils/display.js", () => ({
  createTable: vi.fn(),
}));

vi.mock("@/utils/error-handler.js", () => ({
  handleError: vi.fn(),
}));

vi.mock("@/utils/output.js", () => ({
  outputConditional: vi.fn(),
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
  t: vi.fn((key: string, params?: Record<string, unknown>) => {
    const translations: Record<string, string> = {
      "commands.speakers.name": "speakers",
      "commands.speakers.description": "List available speakers",
      "commands.speakers.invalidResponse": "Invalid response format",
      "commands.speakers.fetching": "Fetching speakers...",
      "commands.speakers.totalSpeakers": `Total: ${params?.["count"] || 0} speakers`,
      "commands.speakers.tableHeaders.name": "Name",
      "commands.speakers.tableHeaders.uuid": "UUID",
      "commands.speakers.tableHeaders.styleName": "Style",
      "commands.speakers.tableHeaders.styleId": "ID",
    };
    return translations[key] || key;
  }),
}));

describe("speakersCommand", () => {
  const mockClient = {
    GET: vi.fn(),
  };

  const mockSpeakers = [
    {
      name: "四国めたん",
      speaker_uuid: "speaker-uuid-1",
      styles: [
        { name: "ノーマル", id: 1 },
        { name: "あまあま", id: 2 },
      ],
    },
    {
      name: "ずんだもん",
      speaker_uuid: "speaker-uuid-2",
      styles: [{ name: "ノーマル", id: 3 }],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (
      createClient as unknown as import("vitest").MockedFunction<
        typeof createClient
      >
    ).mockReturnValue(mockClient as unknown as ReturnType<typeof createClient>);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("正常に話者一覧を取得できる", async () => {
    const mockResponse = { data: mockSpeakers, response: { status: 200 } };

    mockClient.GET.mockResolvedValue(mockResponse);
    (
      validateResponse as unknown as import("vitest").MockedFunction<
        typeof validateResponse
      >
    ).mockReturnValue(
      mockSpeakers as unknown as ReturnType<typeof validateResponse>,
    );
    (
      createTable as unknown as import("vitest").MockedFunction<
        typeof createTable
      >
    ).mockReturnValue("Mock Table Output");

    const args = { baseUrl: "http://localhost:50021", json: false, _: [] };
    await speakersCommand.run?.({ args, rawArgs: [], cmd: speakersCommand });

    expect(createClient).toHaveBeenCalledWith("http://localhost:50021");
    expect(mockClient.GET).toHaveBeenCalledWith("/speakers");
    expect(validateResponse).toHaveBeenCalledWith(
      mockResponse,
      "Invalid response format",
      { baseUrl: "http://localhost:50021" },
    );
    expect(outputConditional).toHaveBeenCalledWith(
      false,
      mockSpeakers,
      expect.any(Function),
    );
  });

  it("JSON形式で出力する", async () => {
    const mockResponse = { data: mockSpeakers, response: { status: 200 } };

    mockClient.GET.mockResolvedValue(mockResponse);
    (
      validateResponse as unknown as import("vitest").MockedFunction<
        typeof validateResponse
      >
    ).mockReturnValue(
      mockSpeakers as unknown as ReturnType<typeof validateResponse>,
    );

    const args = { baseUrl: "http://localhost:50021", json: true, _: [] };
    await speakersCommand.run?.({ args, rawArgs: [], cmd: speakersCommand });

    expect(outputConditional).toHaveBeenCalledWith(
      true,
      mockSpeakers,
      expect.any(Function),
    );
  });

  it("スタイルがない話者を適切に処理する", async () => {
    const speakersWithoutStyles = [
      {
        name: "テスト話者",
        speaker_uuid: "test-uuid",
        styles: [],
      },
    ];
    const mockResponse = {
      data: speakersWithoutStyles,
      response: { status: 200 },
    };

    mockClient.GET.mockResolvedValue(mockResponse);
    (
      validateResponse as unknown as import("vitest").MockedFunction<
        typeof validateResponse
      >
    ).mockReturnValue(
      speakersWithoutStyles as unknown as ReturnType<typeof validateResponse>,
    );
    (
      createTable as unknown as import("vitest").MockedFunction<
        typeof createTable
      >
    ).mockReturnValue("Mock Table Output");

    const args = { baseUrl: "http://localhost:50021", json: false, _: [] };
    await speakersCommand.run?.({ args, rawArgs: [], cmd: speakersCommand });

    // outputConditionalのテキストフォーマッターが呼ばれることを確認
    expect(outputConditional).toHaveBeenCalledWith(
      false,
      speakersWithoutStyles,
      expect.any(Function),
    );
  });

  it("複数スタイルを持つ話者を適切に処理する", async () => {
    const mockResponse = { data: mockSpeakers, response: { status: 200 } };

    mockClient.GET.mockResolvedValue(mockResponse);
    (
      validateResponse as unknown as import("vitest").MockedFunction<
        typeof validateResponse
      >
    ).mockReturnValue(
      mockSpeakers as unknown as ReturnType<typeof validateResponse>,
    );
    (
      createTable as unknown as import("vitest").MockedFunction<
        typeof createTable
      >
    ).mockReturnValue("Mock Table Output");

    const args = { baseUrl: "http://localhost:50021", json: false, _: [] };
    await speakersCommand.run?.({ args, rawArgs: [], cmd: speakersCommand });

    // outputConditionalのテキストフォーマッターが呼ばれることを確認
    expect(outputConditional).toHaveBeenCalledWith(
      false,
      mockSpeakers,
      expect.any(Function),
    );
  });

  it("配列でないレスポンスでエラーを投げる", async () => {
    const invalidResponse = { data: "not an array", response: { status: 200 } };

    mockClient.GET.mockResolvedValue(invalidResponse);
    (
      validateResponse as unknown as import("vitest").MockedFunction<
        typeof validateResponse
      >
    ).mockReturnValue(
      "not an array" as unknown as ReturnType<typeof validateResponse>,
    );

    const args = { baseUrl: "http://localhost:50021", json: false, _: [] };
    await speakersCommand.run?.({ args, rawArgs: [], cmd: speakersCommand });

    expect(handleError).toHaveBeenCalledWith(expect.any(Error), "speakers", {
      baseUrl: "http://localhost:50021",
      json: undefined,
    });
  });

  it("APIエラーが発生した場合にhandleErrorを呼ぶ", async () => {
    const error = new Error("API Error");
    mockClient.GET.mockRejectedValue(error);

    const args = { baseUrl: "http://localhost:50021", json: false, _: [] };
    await speakersCommand.run?.({ args, rawArgs: [], cmd: speakersCommand });

    expect(handleError).toHaveBeenCalledWith(error, "speakers", {
      baseUrl: "http://localhost:50021",
      json: undefined,
    });
  });

  it("デフォルトのベースURLが使用される", async () => {
    const mockResponse = { data: mockSpeakers, response: { status: 200 } };

    mockClient.GET.mockResolvedValue(mockResponse);
    (
      validateResponse as unknown as import("vitest").MockedFunction<
        typeof validateResponse
      >
    ).mockReturnValue(
      mockSpeakers as unknown as ReturnType<typeof validateResponse>,
    );
    (
      createTable as unknown as import("vitest").MockedFunction<
        typeof createTable
      >
    ).mockReturnValue("Mock Table Output");

    const args = { baseUrl: "http://localhost:50021", json: false, _: [] };
    await speakersCommand.run?.({ args, rawArgs: [], cmd: speakersCommand });

    expect(createClient).toHaveBeenCalledWith(undefined);
  });

  it("テーブル出力が正しく生成される", async () => {
    const mockResponse = { data: mockSpeakers, response: { status: 200 } };

    mockClient.GET.mockResolvedValue(mockResponse);
    (
      validateResponse as unknown as import("vitest").MockedFunction<
        typeof validateResponse
      >
    ).mockReturnValue(
      mockSpeakers as unknown as ReturnType<typeof validateResponse>,
    );
    (
      createTable as unknown as import("vitest").MockedFunction<
        typeof createTable
      >
    ).mockReturnValue("Mock Table Output");

    const args = { baseUrl: "http://localhost:50021", json: false, _: [] };
    await speakersCommand.run?.({ args, rawArgs: [], cmd: speakersCommand });

    // outputConditionalのテキストフォーマッターが呼ばれることを確認
    expect(outputConditional).toHaveBeenCalledWith(
      false,
      mockSpeakers,
      expect.any(Function),
    );
  });
});
