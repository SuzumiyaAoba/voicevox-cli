/**
 * VoiceVoxクライアントユーティリティのテスト
 */

import { describe, expect, it, vi } from "vitest";
import { createVoicevoxClient } from "./client.js";

// openapi-fetchのモック
vi.mock("openapi-fetch", () => ({
  default: vi.fn((config) => ({
    GET: vi.fn(),
    POST: vi.fn(),
    PUT: vi.fn(),
    DELETE: vi.fn(),
    _config: config,
  })),
}));

describe("createVoicevoxClient", () => {
  it("指定されたbaseURLでクライアントを作成する", () => {
    const baseUrl = "http://localhost:50021";
    const client = createVoicevoxClient({ baseUrl });

    expect(client).toBeDefined();
    expect(client).toHaveProperty("GET");
    expect(client).toHaveProperty("POST");
  });

  it("異なるbaseURLでクライアントを作成できる", () => {
    const baseUrl = "http://example.com:8080";
    const client = createVoicevoxClient({ baseUrl });

    expect(client).toBeDefined();
    // @ts-expect-error - _configはテスト用のプロパティ
    expect(client._config.baseUrl).toBe(baseUrl);
  });

  it("HTTPSのbaseURLでクライアントを作成できる", () => {
    const baseUrl = "https://secure-api.example.com";
    const client = createVoicevoxClient({ baseUrl });

    expect(client).toBeDefined();
    // @ts-expect-error - _configはテスト用のプロパティ
    expect(client._config.baseUrl).toBe(baseUrl);
  });

  it("ポート番号付きのbaseURLでクライアントを作成できる", () => {
    const baseUrl = "http://192.168.1.1:3000";
    const client = createVoicevoxClient({ baseUrl });

    expect(client).toBeDefined();
    // @ts-expect-error - _configはテスト用のプロパティ
    expect(client._config.baseUrl).toBe(baseUrl);
  });

  it("クライアントが必要なメソッドを持つ", () => {
    const client = createVoicevoxClient({ baseUrl: "http://localhost:50021" });

    expect(client.GET).toBeDefined();
    expect(client.POST).toBeDefined();
    expect(typeof client.GET).toBe("function");
    expect(typeof client.POST).toBe("function");
  });
});
