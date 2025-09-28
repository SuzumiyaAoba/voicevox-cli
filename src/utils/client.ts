import type { paths } from "@suzumiyaaoba/voicevox-client";
import openapiFetch from "openapi-fetch";

/**
 * VOICEVOX Engine APIクライアントを生成する
 * @param options クライアント生成オプション
 * @param options.baseUrl ベースURL
 * @returns openapi-fetchクライアント
 */
export const createVoicevoxClient = ({ baseUrl }: { baseUrl: string }) => {
  return openapiFetch<paths>({
    baseUrl,
  });
};
