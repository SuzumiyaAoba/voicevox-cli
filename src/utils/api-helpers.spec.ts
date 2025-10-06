/**
 * APIヘルパーのテスト
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { createClient, validateResponse, validateResponseResult } from "./api-helpers.js";
import { createVoicevoxClient } from "./client.js";
import { VoicevoxError, ErrorType } from "./error-handler.js";

// モックの設定
vi.mock("./client.js", () => ({
  createVoicevoxClient: vi.fn(),
}));

vi.mock("./error-handler.js", () => ({
  VoicevoxError: vi.fn(),
  ErrorType: {
    API: "API",
  },
}));

describe("createClient", () => {
  const mockClient = { mock: "client" };

  beforeEach(() => {
    vi.clearAllMocks();
    (createVoicevoxClient as any).mockReturnValue(mockClient);
  });

  it("ベースURLが指定された場合、そのURLでクライアントを作成する", () => {
    const baseUrl = "http://example.com:8080";
    const result = createClient(baseUrl);

    expect(createVoicevoxClient).toHaveBeenCalledWith({ baseUrl });
    expect(result).toBe(mockClient);
  });

  it("ベースURLが指定されない場合、デフォルトURLでクライアントを作成する", () => {
    const result = createClient();

    expect(createVoicevoxClient).toHaveBeenCalledWith({
      baseUrl: "http://localhost:50021",
    });
    expect(result).toBe(mockClient);
  });

  it("undefinedが渡された場合、デフォルトURLでクライアントを作成する", () => {
    const result = createClient(undefined);

    expect(createVoicevoxClient).toHaveBeenCalledWith({
      baseUrl: "http://localhost:50021",
    });
    expect(result).toBe(mockClient);
  });
});

describe("validateResponse", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("有効なレスポンスデータを返す", () => {
    const responseData = { id: 1, name: "test" };
    const response = { data: responseData };
    const errorMessage = "Test error";
    const context = { baseUrl: "http://localhost:50021" };

    const result = validateResponse(response, errorMessage, context);

    expect(result).toBe(responseData);
  });

  it("データが存在しない場合、VoicevoxErrorを投げる", () => {
    const response = { data: undefined };
    const errorMessage = "No data found";
    const context = { baseUrl: "http://localhost:50021" };

    // VoicevoxErrorのモックを設定
    const mockError = new Error("VoicevoxError");
    (VoicevoxError as any).mockImplementation(() => mockError);

    expect(() => validateResponse(response, errorMessage, context)).toThrow();
    expect(VoicevoxError).toHaveBeenCalledWith(
      errorMessage,
      ErrorType.API,
      undefined,
      context
    );
  });

  it("nullデータの場合、VoicevoxErrorを投げる", () => {
    const response = { data: null };
    const errorMessage = "Null data";
    const context = { baseUrl: "http://localhost:50021" };

    const mockError = new Error("VoicevoxError");
    (VoicevoxError as any).mockImplementation(() => mockError);

    expect(() => validateResponse(response, errorMessage, context)).toThrow();
  });

  it("空文字列データの場合、VoicevoxErrorを投げる", () => {
    const response = { data: "" };
    const errorMessage = "Empty data";
    const context = { baseUrl: "http://localhost:50021" };

    const mockError = new Error("VoicevoxError");
    (VoicevoxError as any).mockImplementation(() => mockError);

    expect(() => validateResponse(response, errorMessage, context)).toThrow();
  });

  it("コンテキストが指定されない場合でも動作する", () => {
    const responseData = { id: 1 };
    const response = { data: responseData };
    const errorMessage = "Test error";

    const result = validateResponse(response, errorMessage);

    expect(result).toBe(responseData);
  });
});

describe("validateResponseResult", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("有効なレスポンスで成功結果を返す", () => {
    const responseData = { id: 1, name: "test" };
    const response = { data: responseData };
    const errorMessage = "Test error";

    const result = validateResponseResult(response, errorMessage);

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toBe(responseData);
    }
  });

  it("無効なレスポンスでエラー結果を返す", () => {
    const response = { data: undefined };
    const errorMessage = "No data found";

    const result = validateResponseResult(response, errorMessage);

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(Error);
    }
  });

  it("コンテキスト付きでエラー結果を返す", () => {
    const response = { data: null };
    const errorMessage = "Null data";
    const context = { baseUrl: "http://localhost:50021" };

    const result = validateResponseResult(response, errorMessage, context);

    expect(result.isErr()).toBe(true);
  });
});
