import { createVoicevoxClient } from "./client.js";
import { ErrorType, VoicevoxError } from "./error-handler.js";

/**
 * APIクライアントを作成する共通ヘルパー
 * @param baseUrl - ベースURL（オプション）
 * @returns VOICEVOXクライアント
 */
export const createClient = (baseUrl?: string) => {
  return createVoicevoxClient({
    baseUrl: baseUrl || "http://localhost:50021",
  });
};

/**
 * APIレスポンスを検証する共通ヘルパー
 * @param response - APIレスポンス
 * @param errorMessage - エラーメッセージ
 * @param context - エラーコンテキスト
 * @returns レスポンスデータ
 * @throws VoicevoxError - レスポンスが空の場合
 */
export const validateResponse = <T>(
  response: { data?: T },
  errorMessage: string,
  context?: Record<string, unknown>,
): T => {
  if (!response.data) {
    throw new VoicevoxError(errorMessage, ErrorType.API, undefined, context);
  }
  return response.data;
};
