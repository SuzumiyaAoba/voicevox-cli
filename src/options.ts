// 共通オプションの定義
export const commonOptions = {
  baseUrl: {
    type: "string",
    description: "VOICEVOX Engine base URL (default: http://localhost:50021)",
    default: "http://localhost:50021",
  },
} as const;
