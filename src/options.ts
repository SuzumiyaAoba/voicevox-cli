// ベースURLオプションの定義（個別コマンドで使用）
export const baseUrlOption = {
  baseUrl: {
    type: "string",
    description: "VOICEVOX Engine base URL (default: http://localhost:50021)",
    default: "http://localhost:50021",
  },
} as const;
