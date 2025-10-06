/**
 * エラーハンドラーのテスト
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  ErrorType,
  VoicevoxError,
  handleError,
  withErrorHandling,
  withErrorHandlingSync,
} from "./error-handler.js";
import { display, log } from "@/logger.js";

// モックの設定
vi.mock("@/logger.js", () => ({
  display: {
    error: vi.fn(),
  },
  log: {
    error: vi.fn(),
  },
}));

vi.mock("@/i18n/config.js", () => ({
  t: vi.fn((key: string, params?: Record<string, unknown>) => {
    const translations: Record<string, string> = {
      "errors.network": `Network error in ${params?.['command']}`,
      "errors.api": `API error in ${params?.['command']}`,
      "errors.validation": `Validation error in ${params?.['command']}`,
      "errors.unknown": `Unknown error in ${params?.['command']}`,
      "errors.help.network": "Check your network connection",
      "errors.help.api": "Check the API endpoint",
      "errors.help.validation": "Check your input parameters",
    };
    return translations[key] || key;
  }),
}));

// process.exitのモック
const mockExit = vi.spyOn(process, "exit").mockImplementation(() => {
  throw new Error("process.exit called");
});

describe("VoicevoxError", () => {
  it("基本的なエラー情報を正しく設定する", () => {
    const error = new VoicevoxError(
      "Test error",
      ErrorType.API,
      new Error("Original error"),
      { baseUrl: "http://localhost:50021" }
    );

    expect(error.message).toBe("Test error");
    expect(error.type).toBe(ErrorType.API);
    expect(error.originalError).toBeInstanceOf(Error);
    expect(error.context).toEqual({ baseUrl: "http://localhost:50021" });
    expect(error.name).toBe("VoicevoxError");
  });

  it("オプションパラメータなしでエラーを作成できる", () => {
    const error = new VoicevoxError("Simple error", ErrorType.VALIDATION);

    expect(error.message).toBe("Simple error");
    expect(error.type).toBe(ErrorType.VALIDATION);
    expect(error.originalError).toBeUndefined();
    expect(error.context).toBeUndefined();
  });
});

describe("handleError", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    mockExit.mockClear();
  });

  it("VoicevoxErrorを適切に処理する", () => {
    const error = new VoicevoxError("API Error", ErrorType.API);
    const command = "test-command";
    const context = { baseUrl: "http://localhost:50021" };

    expect(() => handleError(error, command, context)).toThrow("process.exit called");

    expect(log.error).toHaveBeenCalledWith(
      `Error in ${command} command`,
      expect.objectContaining({
        errorType: ErrorType.API,
        error: "API Error",
        context,
      })
    );

    expect(display.error).toHaveBeenCalledWith(`API error in ${command}`);
    expect(display.error).toHaveBeenCalledWith("  API Error");
    expect(display.error).toHaveBeenCalledWith("  Check the API endpoint");
  });

  it("ネットワークエラーを適切に分類する", () => {
    const error = new Error("Network connection failed");
    const command = "test-command";

    expect(() => handleError(error, command)).toThrow("process.exit called");

    expect(log.error).toHaveBeenCalledWith(
      `Error in ${command} command`,
      expect.objectContaining({
        errorType: ErrorType.NETWORK,
      })
    );

    expect(display.error).toHaveBeenCalledWith(`Network error in ${command}`);
    expect(display.error).toHaveBeenCalledWith("  Network connection failed");
    expect(display.error).toHaveBeenCalledWith("  Check your network connection");
  });

  it("APIエラーを適切に分類する", () => {
    const error = new Error("API response error");
    const command = "test-command";

    expect(() => handleError(error, command)).toThrow("process.exit called");

    expect(log.error).toHaveBeenCalledWith(
      `Error in ${command} command`,
      expect.objectContaining({
        errorType: ErrorType.API,
      })
    );

    expect(display.error).toHaveBeenCalledWith(`API error in ${command}`);
  });

  it("バリデーションエラーを適切に分類する", () => {
    const error = new Error("Invalid input validation");
    const command = "test-command";

    expect(() => handleError(error, command)).toThrow("process.exit called");

    expect(log.error).toHaveBeenCalledWith(
      `Error in ${command} command`,
      expect.objectContaining({
        errorType: ErrorType.VALIDATION,
      })
    );

    expect(display.error).toHaveBeenCalledWith(`Validation error in ${command}`);
    expect(display.error).toHaveBeenCalledWith("  Check your input parameters");
  });

  it("不明なエラーを適切に処理する", () => {
    const error = new Error("Some random error");
    const command = "test-command";

    expect(() => handleError(error, command)).toThrow("process.exit called");

    expect(log.error).toHaveBeenCalledWith(
      `Error in ${command} command`,
      expect.objectContaining({
        errorType: ErrorType.UNKNOWN,
      })
    );

    expect(display.error).toHaveBeenCalledWith(`Unknown error in ${command}`);
  });

  it("Error以外のオブジェクトを適切に処理する", () => {
    const error = "String error";
    const command = "test-command";

    expect(() => handleError(error, command)).toThrow("process.exit called");

    expect(log.error).toHaveBeenCalledWith(
      `Error in ${command} command`,
      expect.objectContaining({
        errorType: ErrorType.UNKNOWN,
        error: "String error",
      })
    );
  });

  it("スタックトレースを適切に記録する", () => {
    const error = new Error("Test error");
    error.stack = "Error: Test error\n    at test.js:1:1";
    const command = "test-command";

    expect(() => handleError(error, command)).toThrow("process.exit called");

    expect(log.error).toHaveBeenCalledWith(
      `Error in ${command} command`,
      expect.objectContaining({
        stack: "Error: Test error\n    at test.js:1:1",
      })
    );
  });
});

describe("withErrorHandling", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("正常な関数を実行する", async () => {
    const mockFn = vi.fn().mockResolvedValue("success");
    const wrappedFn = withErrorHandling(mockFn, "test-command");

    const result = await wrappedFn("arg1", "arg2");

    expect(result).toBe("success");
    expect(mockFn).toHaveBeenCalledWith("arg1", "arg2");
  });

  it("エラーが発生した場合にhandleErrorを呼ぶ", async () => {
    const error = new Error("Test error");
    const mockFn = vi.fn().mockRejectedValue(error);
    const wrappedFn = withErrorHandling(mockFn, "test-command");

    await expect(() => wrappedFn("arg1")).rejects.toThrow("process.exit called");
  });
});

describe("withErrorHandlingSync", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("正常な同期関数を実行する", () => {
    const mockFn = vi.fn().mockReturnValue("success");
    const wrappedFn = withErrorHandlingSync(mockFn, "test-command");

    const result = wrappedFn("arg1", "arg2");

    expect(result).toBe("success");
    expect(mockFn).toHaveBeenCalledWith("arg1", "arg2");
  });

  it("エラーが発生した場合にhandleErrorを呼ぶ", () => {
    const error = new Error("Test error");
    const mockFn = vi.fn().mockImplementation(() => {
      throw error;
    });
    const wrappedFn = withErrorHandlingSync(mockFn, "test-command");

    expect(() => wrappedFn("arg1")).toThrow("process.exit called");
  });
});
