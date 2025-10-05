import { t } from "@/i18n/config.js";
import { display, log } from "@/logger.js";

/**
 * エラータイプの定義
 *
 * VOICEVOX CLIで発生する可能性のあるエラーの種類を定義する。
 */
export enum ErrorType {
  /** ネットワーク関連のエラー */
  NETWORK = "NETWORK",
  /** API関連のエラー */
  API = "API",
  /** バリデーション関連のエラー */
  VALIDATION = "VALIDATION",
  /** 不明なエラー */
  UNKNOWN = "UNKNOWN",
}

/**
 * VOICEVOX CLI専用のカスタムエラークラス
 *
 * エラーの種類、元のエラー、コンテキスト情報を含む拡張エラークラス。
 * エラーハンドリングとログ出力の改善に使用される。
 *
 * @example
 * ```typescript
 * throw new VoicevoxError(
 *   "API request failed",
 *   ErrorType.API,
 *   originalError,
 *   { baseUrl: "http://localhost:50021" }
 * );
 * ```
 */
export class VoicevoxError extends Error {
  /**
   * @param message - エラーメッセージ
   * @param type - エラーの種類
   * @param originalError - 元のエラー（オプション）
   * @param context - エラーコンテキスト（オプション）
   */
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

/**
 * エラーの種類を判定する内部関数
 *
 * エラーメッセージやエラータイプから適切なエラー種類を分類します。
 *
 * @param error - 判定対象のエラー
 * @returns エラータイプ
 */
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

/**
 * エラータイプに応じた適切なエラーメッセージを生成する内部関数
 *
 * @param errorType - エラータイプ
 * @param command - 実行されたコマンド名
 * @returns ローカライズされたエラーメッセージ
 */
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

/**
 * エラーオブジェクトから詳細メッセージを抽出する内部関数
 *
 * @param error - エラーオブジェクト
 * @returns エラーの詳細メッセージ
 */
const getErrorDetails = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
};

/**
 * エラータイプに応じたヘルプメッセージを取得する内部関数
 *
 * @param errorType - エラータイプ
 * @returns ローカライズされたヘルプメッセージ、または null
 */
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

/**
 * メインのエラーハンドリング関数
 *
 * エラーを適切に分類し、ユーザー向けメッセージを表示してプロセスを終了します。
 * エラーの詳細はデバッグログに記録されます。
 *
 * @param error - 処理するエラー
 * @param command - エラーが発生したコマンド名
 * @param context - 追加のコンテキスト情報
 * @throws プロセスを終了するため、この関数は決して正常に戻りません
 *
 * @example
 * ```typescript
 * try {
 *   // ... some operation
 * } catch (error) {
 *   handleError(error, "synthesis", { speaker: "1" });
 * }
 * ```
 */
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

/**
 * 非同期関数のエラーハンドリングラッパー
 *
 * 非同期関数を実行し、エラーが発生した場合は適切にハンドリングします。
 *
 * @param fn - ラップする非同期関数
 * @param command - コマンド名
 * @returns エラーハンドリングが追加された関数
 *
 * @example
 * ```typescript
 * const safeFunction = withErrorHandling(async (text: string) => {
 *   return await synthesize(text);
 * }, "synthesis");
 * ```
 */
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

/**
 * 同期関数のエラーハンドリングラッパー
 *
 * 同期関数を実行し、エラーが発生した場合は適切にハンドリングします。
 *
 * @param fn - ラップする同期関数
 * @param command - コマンド名
 * @returns エラーハンドリングが追加された関数
 *
 * @example
 * ```typescript
 * const safeFunction = withErrorHandlingSync((data: string) => {
 *   return JSON.parse(data);
 * }, "parse");
 * ```
 */
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
