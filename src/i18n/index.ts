// 翻訳データの型定義
type TranslationData = Record<string, unknown>;

// 利用可能なロケール
export const SUPPORTED_LOCALES = ["ja", "en"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

// デフォルトロケール
const DEFAULT_LOCALE: Locale = "ja";

// 現在のロケールを取得（環境変数から）
const getCurrentLocale = (): Locale => {
  const envLocale = process.env.LANG?.split(".")[0]?.split("_")[0];
  if (envLocale && SUPPORTED_LOCALES.includes(envLocale as Locale)) {
    return envLocale as Locale;
  }
  return DEFAULT_LOCALE;
};

// 翻訳データを直接埋め込み
const translations: Record<Locale, TranslationData> = {
  ja: {
    commands: {
      synthesis: {
        name: "synthesis",
        description: "テキストから音声を合成する",
        synthesizing: '音声合成中: "{text}"',
        speakerId: "話者ID: {speaker}",
        output: "出力: {output}",
        play: "再生: {play}",
        args: {
          text: "合成するテキスト",
          speaker: "話者ID（デフォルト: 2）",
          output: "出力ファイルパス",
          play: "合成後に音声を再生",
        },
        synthesisError: "音声合成中にエラーが発生しました",
        synthesisComplete: "音声合成が完了しました: {output}",
        playingAudio: "音声を再生中...",
        makeSureEngineRunning:
          "指定されたURLでVOICEVOX Engineが起動していることを確認してください",
        playerNotFound: "音声プレイヤーが見つかりません",
        playerError: "音声再生中にエラーが発生しました",
      },
      query: {
        name: "query",
        description: "音声クエリ関連のコマンド",
        create: {
          name: "create",
          description: "テキストから音声クエリを生成する",
          querying: '音声クエリ生成中: "{text}"',
          speakerId: "話者ID: {speaker}",
          args: {
            text: "クエリを生成するテキスト",
            speaker: "話者ID（デフォルト: 2）",
            enableKatakanaEnglish: "英語をカタカナに変換してから処理",
            json: "JSON形式で出力する",
          },
          queryError: "音声クエリ生成中にエラーが発生しました",
          queryComplete: "音声クエリが完了しました",
          queryResult: "音声クエリ結果:",
          makeSureEngineRunning:
            "指定されたURLでVOICEVOX Engineが起動していることを確認してください",
        },
      },
      speakers: {
        name: "speakers",
        description: "利用可能な話者一覧を表示",
        fetching: "利用可能な話者を取得中...",
        totalSpeakers: "合計 {count} 人の話者が見つかりました",
        invalidResponse: "無効なレスポンス形式",
        errorFetching: "話者一覧の取得中にエラーが発生しました:",
        makeSureEngineRunning:
          "指定されたURLでVOICEVOX Engineが起動していることを確認してください",
        args: {
          json: "JSON形式で出力",
        },
      },
      presets: {
        name: "presets",
        description: "利用可能なプリセット一覧を表示",
        fetching: "利用可能なプリセットを取得中...",
        totalPresets: "合計 {count} 個のプリセットが見つかりました",
        noPresets: "プリセットが見つかりませんでした",
        args: {
          json: "JSON形式で出力する",
        },
        errorFetching: "プリセット一覧の取得中にエラーが発生しました:",
        makeSureEngineRunning:
          "指定されたURLでVOICEVOX Engineが起動していることを確認してください",
      },
      version: {
        name: "version",
        description: "バージョン情報を表示",
      },
      engine: {
        name: "engine",
        description: "VOICEVOX Engine関連のコマンド",
        version: {
          name: "version",
          description: "VOICEVOX Engineのバージョン情報を表示",
          engineVersion: "VOICEVOX Engine バージョン: {version}",
          invalidResponse: "無効なレスポンス形式",
          errorFetching: "エンジンバージョンの取得中にエラーが発生しました:",
          makeSureEngineRunning:
            "指定されたURLでVOICEVOX Engineが起動していることを確認してください",
          unknownError: "不明なエラーが発生しました",
          args: {
            json: "JSON形式で出力",
          },
        },
      },
    },
    common: {
      error: "エラー",
      unknown: "不明",
    },
  },
  en: {
    commands: {
      synthesis: {
        name: "synthesis",
        description: "Synthesize speech from text",
        synthesizing: 'Synthesizing: "{text}"',
        speakerId: "Speaker ID: {speaker}",
        output: "Output: {output}",
        play: "Play: {play}",
        args: {
          text: "Text to synthesize",
          speaker: "Speaker ID (default: 2)",
          output: "Output file path",
          play: "Play audio after synthesis",
        },
        synthesisError: "Error occurred during synthesis",
        synthesisComplete: "Synthesis completed: {output}",
        playingAudio: "Playing audio...",
        makeSureEngineRunning:
          "Make sure VOICEVOX Engine is running on the specified URL",
        playerNotFound: "Audio player not found",
        playerError: "Error occurred during audio playback",
      },
      query: {
        name: "query",
        description: "Audio query related commands",
        create: {
          name: "create",
          description: "Generate audio query from text",
          querying: 'Generating audio query: "{text}"',
          speakerId: "Speaker ID: {speaker}",
          args: {
            text: "Text to generate query for",
            speaker: "Speaker ID (default: 2)",
            enableKatakanaEnglish:
              "Convert English to katakana before processing",
            json: "Output in JSON format",
          },
          queryError: "Error occurred during audio query generation",
          queryComplete: "Audio query completed",
          queryResult: "Audio query result:",
          makeSureEngineRunning:
            "Make sure VOICEVOX Engine is running on the specified URL",
        },
      },
      speakers: {
        name: "speakers",
        description: "List available speakers",
        fetching: "Fetching available speakers...",
        totalSpeakers: "Total {count} speakers found",
        invalidResponse: "Invalid response format",
        errorFetching: "Error fetching speakers:",
        makeSureEngineRunning:
          "Make sure VOICEVOX Engine is running on the specified URL",
        args: {
          json: "Output in JSON format",
        },
      },
      presets: {
        name: "presets",
        description: "List available presets",
        fetching: "Fetching available presets...",
        totalPresets: "Total {count} presets found",
        noPresets: "No presets found",
        args: {
          json: "Output in JSON format",
        },
        errorFetching: "Error fetching presets:",
        makeSureEngineRunning:
          "Make sure VOICEVOX Engine is running on the specified URL",
      },
      version: {
        name: "version",
        description: "Show version information",
      },
      engine: {
        name: "engine",
        description: "VOICEVOX Engine related commands",
        version: {
          name: "version",
          description: "Show VOICEVOX Engine version information",
          engineVersion: "VOICEVOX Engine Version: {version}",
          invalidResponse: "Invalid response format",
          errorFetching: "Error fetching engine version:",
          makeSureEngineRunning:
            "Make sure VOICEVOX Engine is running on the specified URL",
          unknownError: "Unknown error occurred",
          args: {
            json: "Output in JSON format",
          },
        },
      },
    },
    common: {
      error: "Error",
      unknown: "Unknown",
    },
  },
};

// 現在のロケール
const currentLocale = getCurrentLocale();

// 現在の翻訳データ
const currentTranslations = translations[currentLocale];

/**
 * 翻訳キーから値を取得する
 * @param key 翻訳キー（ドット記法でネストしたオブジェクトにアクセス）
 * @param params 置換パラメータ
 * @returns 翻訳された文字列
 */
export const t = (
  key: string,
  params: Record<string, string | number> = {},
): string => {
  const keys = key.split(".");
  let value: unknown = currentTranslations;

  // ネストしたキーを辿る
  for (const k of keys) {
    if (value && typeof value === "object" && value !== null && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      // キーが見つからない場合はキー自体を返す
      return key;
    }
  }

  if (typeof value !== "string") {
    return key;
  }

  // パラメータを置換
  return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
    return String(params[paramKey] || match);
  });
};

/**
 * 現在のロケールを取得
 * @returns 現在のロケール
 */
export const getLocale = (): Locale => {
  return currentLocale;
};

/**
 * 利用可能なロケールを取得
 * @returns 利用可能なロケールの配列
 */
export const getSupportedLocales = (): readonly Locale[] => {
  return SUPPORTED_LOCALES;
};
