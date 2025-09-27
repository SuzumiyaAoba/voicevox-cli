import pino from "pino";

// ログレベルを環境変数から取得（デフォルト: info）
const logLevel = process.env["LOG_LEVEL"] || "info";

// pinoロガーの設定
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

// ログレベル定数
export const LOG_LEVELS = {
  TRACE: 10,
  DEBUG: 20,
  INFO: 30,
  WARN: 40,
  ERROR: 50,
  FATAL: 60,
} as const;

// ユーザー向けメッセージ用のログ（常に表示）
export const logUser = {
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

// デバッグ情報用のログ（debugレベル以上で表示）
export const logDebug = {
  trace: (message: string, data?: unknown) => logger.trace(data, message),
  debug: (message: string, data?: unknown) => logger.debug(data, message),
  info: (message: string, data?: unknown) => logger.info(data, message),
  warn: (message: string, data?: unknown) => logger.warn(data, message),
  error: (message: string, data?: unknown) => logger.error(data, message),
};
