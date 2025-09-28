import { t } from "@/i18n/index.js";
import { display, log } from "@/logger.js";

// エラータイプの定義
export enum ErrorType {
  NETWORK = "NETWORK",
  API = "API",
  VALIDATION = "VALIDATION",
  UNKNOWN = "UNKNOWN",
}

// カスタムエラークラス
export class VoicevoxError extends Error {
  constructor(
    message: string,
    public type: ErrorType,
    public originalError?: Error,
    public context?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "VoicevoxError";
  }
}

// エラーの種類を判定する関数
const classifyError = (error: unknown): ErrorType => {
  if (error instanceof VoicevoxError) {
    return error.type;
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    // ネットワーク関連のエラー
    if (
      message.includes("fetch") ||
      message.includes("network") ||
      message.includes("connection") ||
      message.includes("timeout")
    ) {
      return ErrorType.NETWORK;
    }

    // API関連のエラー
    if (
      message.includes("api") ||
      message.includes("http") ||
      message.includes("response")
    ) {
      return ErrorType.API;
    }

    // バリデーション関連のエラー
    if (
      message.includes("validation") ||
      message.includes("invalid") ||
      message.includes("required")
    ) {
      return ErrorType.VALIDATION;
    }
  }

  return ErrorType.UNKNOWN;
};

// エラーメッセージを生成する関数
const getErrorMessage = (errorType: ErrorType, command: string): string => {
  switch (errorType) {
    case ErrorType.NETWORK:
      return t("errors.network", { command });
    case ErrorType.API:
      return t("errors.api", { command });
    case ErrorType.VALIDATION:
      return t("errors.validation", { command });
    default:
      return t("errors.unknown", { command });
  }
};

// エラーの詳細メッセージを生成する関数
const getErrorDetails = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
};

// エラーのヘルプメッセージを生成する関数
const getErrorHelp = (errorType: ErrorType): string | null => {
  switch (errorType) {
    case ErrorType.NETWORK:
      return t("errors.help.network");
    case ErrorType.API:
      return t("errors.help.api");
    case ErrorType.VALIDATION:
      return t("errors.help.validation");
    default:
      return null;
  }
};

// メインのエラーハンドリング関数
export const handleError = (
  error: unknown,
  command: string,
  context?: Record<string, unknown>,
): never => {
  const errorType = classifyError(error);
  const errorMessage = getErrorMessage(errorType, command);
  const errorDetails = getErrorDetails(error);
  const errorHelp = getErrorHelp(errorType);

  // ログにエラーを記録
  log.error(`Error in ${command} command`, {
    errorType,
    error: errorDetails,
    stack: error instanceof Error ? error.stack : undefined,
    context,
  });

  // ユーザー向けエラーメッセージを表示
  display.error(errorMessage);
  display.error(`  ${errorDetails}`);

  // ヘルプメッセージがあれば表示
  if (errorHelp) {
    display.error(`  ${errorHelp}`);
  }

  // プロセスを終了
  process.exit(1);
};

// 非同期関数のエラーハンドリング用のラッパー
export const withErrorHandling = <T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
  command: string,
) => {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error, command);
      // handleErrorはneverを返すので、この行には到達しない
      throw error;
    }
  };
};

// 同期関数のエラーハンドリング用のラッパー
export const withErrorHandlingSync = <T extends unknown[], R>(
  fn: (...args: T) => R,
  command: string,
) => {
  return (...args: T): R => {
    try {
      return fn(...args);
    } catch (error) {
      handleError(error, command);
      // handleErrorはneverを返すので、この行には到達しない
      throw error;
    }
  };
};
