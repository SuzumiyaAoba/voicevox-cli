/**
 * ロギングおよび表示ユーティリティ
 *
 * このモジュールは、デバッグログとユーザー向け出力の両方を提供します。
 * - デバッグログ: LOG_LEVEL環境変数で制御される構造化ログ（pino）
 * - ユーザー出力: 常に表示される標準出力（UNIX哲学に準拠）
 *
 * @module logger
 */

import pino from "pino";

/**
 * ログレベル（環境変数から取得、デフォルト: info）
 */
const logLevel = process.env.LOG_LEVEL || "info";

/**
 * pinoロガーインスタンス
 *
 * LOG_LEVEL環境変数で制御される構造化ログを提供します。
 * デフォルトではpino-prettyトランスポートを使用して読みやすい形式で出力します。
 */
export const logger = pino({
  level: logLevel,
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:standard",
      ignore: "pid,hostname",
    },
  },
});

/**
 * ログレベルの数値定数
 * pinoの内部レベルに対応します。
 */
export const LOG_LEVELS = {
  /** トレースレベル (最も詳細) */
  TRACE: 10,
  /** デバッグレベル */
  DEBUG: 20,
  /** 情報レベル */
  INFO: 30,
  /** 警告レベル */
  WARN: 40,
  /** エラーレベル */
  ERROR: 50,
  /** 致命的エラーレベル (最も重要) */
  FATAL: 60,
} as const;

/**
 * ユーザー向けメッセージ表示オブジェクト
 *
 * LOG_LEVEL設定に関係なく常に表示されます。
 * EPIPEエラー（パイプラインの途中終了）を適切に処理します。
 *
 * @example
 * ```typescript
 * display.info("処理が完了しました");
 * display.error("エラーが発生しました");
 * ```
 */
export const display = {
  /**
   * 情報メッセージを標準出力に表示
   * @param message - 表示するメッセージ
   * @param args - 追加の引数（console.logに渡される）
   */
  info: (message: string, ...args: unknown[]) => {
    try {
      console.log(message, ...args);
    } catch (error) {
      // EPIPEエラーを無視（パイプライン処理での正常な終了）
      if (error instanceof Error && "code" in error && error.code === "EPIPE") {
        process.exit(0);
      }
      throw error;
    }
  },
  /**
   * エラーメッセージを標準エラー出力に表示
   * @param message - 表示するメッセージ
   * @param args - 追加の引数（console.errorに渡される）
   */
  error: (message: string, ...args: unknown[]) => {
    try {
      console.error(message, ...args);
    } catch (error) {
      if (error instanceof Error && "code" in error && error.code === "EPIPE") {
        process.exit(1);
      }
      throw error;
    }
  },
  /**
   * 警告メッセージを標準エラー出力に表示
   * @param message - 表示するメッセージ
   * @param args - 追加の引数（console.warnに渡される）
   */
  warn: (message: string, ...args: unknown[]) => {
    try {
      console.warn(message, ...args);
    } catch (error) {
      if (error instanceof Error && "code" in error && error.code === "EPIPE") {
        process.exit(0);
      }
      throw error;
    }
  },
};

/**
 * デバッグ情報用の構造化ログオブジェクト
 *
 * LOG_LEVEL環境変数で制御されます。
 * 各関数はメッセージと構造化データを受け取ります。
 *
 * @example
 * ```typescript
 * log.debug("API呼び出し開始", { endpoint: "/speakers" });
 * log.error("エラーが発生", { error: err });
 * ```
 */
export const log = {
  /**
   * トレースレベルのログを出力
   * @param message - ログメッセージ
   * @param data - 構造化データ（オプション）
   */
  trace: (message: string, data?: unknown) => logger.trace(data, message),
  /**
   * デバッグレベルのログを出力
   * @param message - ログメッセージ
   * @param data - 構造化データ（オプション）
   */
  debug: (message: string, data?: unknown) => logger.debug(data, message),
  /**
   * 情報レベルのログを出力
   * @param message - ログメッセージ
   * @param data - 構造化データ（オプション）
   */
  info: (message: string, data?: unknown) => logger.info(data, message),
  /**
   * 警告レベルのログを出力
   * @param message - ログメッセージ
   * @param data - 構造化データ（オプション）
   */
  warn: (message: string, data?: unknown) => logger.warn(data, message),
  /**
   * エラーレベルのログを出力
   * @param message - ログメッセージ
   * @param data - 構造化データ（オプション）
   */
  error: (message: string, data?: unknown) => logger.error(data, message),
};
