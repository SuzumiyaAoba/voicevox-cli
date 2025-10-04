// 翻訳データの型定義
// 厳密な型定義の代わりに、より柔軟で保守しやすい型を使用
type TranslationData = Record<string, unknown>;

// 利用可能なロケール
export const SUPPORTED_LOCALES = ["ja", "en"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

// デフォルトロケール
const DEFAULT_LOCALE: Locale = "ja";

// 現在のロケールを取得（環境変数から）
export const getLocale = (): Locale => {
  const envLocale = process.env.LANG?.split(".")[0]?.split("_")[0];
  if (envLocale && SUPPORTED_LOCALES.includes(envLocale as Locale)) {
    return envLocale as Locale;
  }
  return DEFAULT_LOCALE;
};

// 翻訳データを直接埋め込み
export const translations: Record<Locale, TranslationData> = {
  ja: {
    commands: {
      synthesis: {
        name: "synthesis",
        description: "テキストから音声を合成する",
        synthesizing: "音声合成中: {{text}}",
        loadingInput: "入力ファイルを読み込み中: {{input}}",
        loadingMultiInput: "複数の音声クエリを読み込み中: {{input}}",
        loadingMultiText: "複数行のテキストファイルを読み込み中: {{count}} 行",
        speakerId: "話者ID: {{speaker}}",
        output: "出力: {{output}}",
        play: "再生: {{play}}",
        args: {
          text: "合成するテキスト",
          speaker: "話者ID（デフォルト: 2）",
          input: "入力ファイルパス",
          output: "出力ファイルパス",
          play: "合成後に音声を再生",
          type: "入力タイプ（text/audio_query）",
          multi: "複数行テキストファイルの処理",
        },
        synthesisError: "音声合成中にエラーが発生しました",
        synthesisComplete: "音声合成が完了しました: {{output}}",
        multiSynthesisComplete:
          "複数音声合成完了: {{count}} 件の音声クエリを処理しました",
        playingAudio: "音声を再生中...",
        playingMultipleAudio: "複数の音声ファイルを再生中: {{count}} 件",
        playingAudioFile: "再生中 ({{current}}/{{total}}): {{file}}",
        noAudioFilesInZip: "ZIPファイル内に音声ファイルが見つかりませんでした",
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
          querying: '音声クエリ生成中: "{{text}}"',
          speakerId: "話者ID: {{speaker}}",
          usingPreset: "プリセットIDで生成: {{presetId}}",
          args: {
            text: "クエリを生成するテキスト",
            speaker: "話者ID（デフォルト: 2）",
            enableKatakanaEnglish: "英語をカタカナに変換してから処理",
            presetId: "プリセットIDを指定してクエリを生成",
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
        totalSpeakers: "合計 {{count}} 人の話者が見つかりました",
        invalidResponse: "無効なレスポンス形式",
        errorFetching: "話者一覧の取得中にエラーが発生しました:",
        makeSureEngineRunning:
          "指定されたURLでVOICEVOX Engineが起動していることを確認してください",
        args: {
          json: "JSON形式で出力",
        },
      },
      setting: {
        name: "setting",
        description: "VOICEVOX Engineの情報を表示",
        fetching: "エンジン情報を取得中...",
        settingInfo: "エンジン情報",
        settingData: "エンジンデータ",
        args: {
          json: "JSON形式で出力",
        },
        errorFetching: "エンジン情報の取得中にエラーが発生しました:",
        makeSureEngineRunning:
          "指定されたURLでVOICEVOX Engineが起動していることを確認してください",
        update: {
          name: "update",
          description: "VOICEVOX Engineの設定を更新",
          success: "設定の更新が完了しました",
          updatedSettings: "更新された設定",
          corsPolicyMode: "CORSポリシーモード",
          allowOrigin: "許可オリジン",
          args: {
            corsPolicyMode: "CORSポリシーモード (all または localapps)",
            allowOrigin: "許可するオリジン (corsPolicyModeがallの場合のみ)",
          },
          errorUpdating: "設定の更新中にエラーが発生しました:",
        },
      },
      presets: {
        name: "presets",
        description: "プリセット関連のコマンド",
        list: {
          name: "list",
          description: "利用可能なプリセット一覧を表示",
          fetching: "利用可能なプリセットを取得中...",
          totalPresets: "合計 {{count}} 個のプリセットが見つかりました",
          noPresets: "プリセットが見つかりませんでした",
          args: {
            json: "JSON形式で出力する",
          },
          errorFetching: "プリセット一覧の取得中にエラーが発生しました:",
          makeSureEngineRunning:
            "指定されたURLでVOICEVOX Engineが起動していることを確認してください",
        },
        add: {
          name: "add",
          description: "新しいプリセットを追加する",
          adding: "プリセットを追加中: {{name}}",
          added: "プリセットが追加されました: {{name}}",
          presetId: "プリセットID: {{id}}",
          args: {
            id: "プリセットID",
            name: "プリセット名",
            speaker: "話者UUID",
            style: "スタイルID",
            speed: "速度スケール",
            pitch: "ピッチスケール",
            intonation: "イントネーションスケール",
            volume: "音量スケール",
            prePhonemeLength: "前音素長",
            postPhonemeLength: "後音素長",
            json: "JSON形式で出力する",
          },
          errorAdding: "プリセット追加中にエラーが発生しました:",
          makeSureEngineRunning:
            "指定されたURLでVOICEVOX Engineが起動していることを確認してください",
        },
        update: {
          name: "update",
          description: "既存のプリセットを更新する",
          updating: "プリセットを更新中: ID {{id}}",
          updated: "プリセットが更新されました: ID {{id}}",
          args: {
            id: "プリセットID",
            name: "プリセット名",
            speaker: "話者UUID",
            style: "スタイルID",
            speed: "速度スケール",
            pitch: "ピッチスケール",
            intonation: "イントネーションスケール",
            volume: "音量スケール",
            prePhonemeLength: "前音素長",
            postPhonemeLength: "後音素長",
            json: "JSON形式で出力する",
          },
          errorUpdating: "プリセット更新中にエラーが発生しました:",
          makeSureEngineRunning:
            "指定されたURLでVOICEVOX Engineが起動していることを確認してください",
        },
        delete: {
          name: "delete",
          description: "既存のプリセットを削除する",
          deleting: "プリセットを削除中: ID {{id}}",
          deleted: "プリセットが削除されました: ID {{id}}",
          args: {
            id: "プリセットID",
            json: "JSON形式で出力する",
          },
          errorDeleting: "プリセット削除中にエラーが発生しました:",
          makeSureEngineRunning:
            "指定されたURLでVOICEVOX Engineが起動していることを確認してください",
        },
      },
      version: {
        name: "version",
        description: "バージョン情報を表示",
      },
      devices: {
        name: "devices",
        description: "対応デバイス一覧を表示",
        fetching: "対応デバイス一覧を取得中...",
        devicesInfo: "対応デバイス情報",
        deviceName: "デバイス名",
        deviceType: "デバイスタイプ",
        deviceId: "デバイスID",
        deviceUuid: "デバイスUUID",
        deviceModel: "デバイスモデル",
        deviceSpeaker: "デバイススピーカー",
        deviceSpeakerUuid: "デバイススピーカーUUID",
        deviceSpeakerName: "デバイススピーカー名",
        deviceSpeakerSpeakerUuid: "デバイススピーカースピーカーUUID",
        deviceSpeakerSpeakerName: "デバイススピーカースピーカー名",
        deviceSpeakerSpeakerStyleId: "デバイススピーカースピーカースタイルID",
        deviceSpeakerSpeakerStyleName: "デバイススピーカースピーカースタイル名",
        deviceSpeakerSpeakerVoiceSamples:
          "デバイススピーカースピーカーボイスサンプル",
        args: {
          json: "JSON形式で出力",
        },
        errorFetching: "対応デバイス一覧の取得中にエラーが発生しました:",
        makeSureEngineRunning:
          "指定されたURLでVOICEVOX Engineが起動していることを確認してください",
      },
      engine: {
        name: "engine",
        description: "VOICEVOX Engine関連のコマンド",
        manifest: {
          name: "manifest",
          description: "VOICEVOX Engineのマニフェスト情報を表示",
          fetching: "エンジンマニフェストを取得中...",
          manifestInfo: "エンジンマニフェスト情報",
          engineName: "エンジン名",
          brandName: "ブランド名",
          version: "マニフェストバージョン",
          uuid: "エンジンUUID",
          url: "エンジンURL",
          defaultSamplingRate: "デフォルトサンプリングレート",
          frameRate: "フレームレート",
          supportedFeatures: "対応機能",
          args: {
            json: "JSON形式で出力",
          },
          errorFetching: "エンジンマニフェストの取得中にエラーが発生しました:",
          makeSureEngineRunning:
            "指定されたURLでVOICEVOX Engineが起動していることを確認してください",
        },
        version: {
          name: "version",
          description: "VOICEVOX Engineのバージョン情報を表示",
          engineVersion: "VOICEVOX Engine バージョン: {{version}}",
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
      core: {
        name: "core",
        description: "VOICEVOX Core関連のコマンド",
        versions: {
          name: "versions",
          description: "利用可能なコアバージョン一覧を表示",
          fetching: "コアバージョン一覧を取得中...",
          versionsFound: "利用可能なコアバージョン:",
          args: {
            json: "JSON形式で出力",
          },
          errorFetching: "コアバージョン一覧の取得中にエラーが発生しました:",
          makeSureEngineRunning:
            "指定されたURLでVOICEVOX Engineが起動していることを確認してください",
        },
      },
    },
    common: {
      error: "エラー",
      unknown: "不明",
      args: {
        json: "JSON形式で出力",
      },
    },
  },
  en: {
    commands: {
      synthesis: {
        name: "synthesis",
        description: "Synthesize speech from text",
        synthesizing: 'Synthesizing: "{{text}}"',
        loadingInput: "Loading input file: {{input}}",
        loadingMultiInput: "Loading multiple audio queries: {{input}}",
        loadingMultiText: "Loading multi-line text file: {{count}} lines",
        speakerId: "Speaker ID: {{speaker}}",
        output: "Output: {{output}}",
        play: "Play: {{play}}",
        args: {
          text: "Text to synthesize",
          speaker: "Speaker ID (default: 2)",
          input: "Input file path",
          output: "Output file path",
          play: "Play audio after synthesis",
          type: "Input type (text/audio_query)",
          multi: "Process multi-line text file",
        },
        synthesisError: "Error occurred during synthesis",
        synthesisComplete: "Synthesis completed: {{output}}",
        multiSynthesisComplete:
          "Multi-synthesis complete: {{count}} audio queries processed",
        playingAudio: "Playing audio...",
        playingMultipleAudio: "Playing multiple audio files: {{count}} files",
        playingAudioFile: "Playing ({{current}}/{{total}}): {{file}}",
        noAudioFilesInZip: "No audio files found in ZIP",
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
          querying: 'Generating audio query: "{{text}}"',
          speakerId: "Speaker ID: {{speaker}}",
          usingPreset: "Using preset ID: {{presetId}}",
          args: {
            text: "Text to generate query for",
            speaker: "Speaker ID (default: 2)",
            enableKatakanaEnglish:
              "Convert English to katakana before processing",
            presetId: "Generate query with specified preset ID",
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
        totalSpeakers: "Total {{count}} speakers found",
        invalidResponse: "Invalid response format",
        errorFetching: "Error fetching speakers:",
        makeSureEngineRunning:
          "Make sure VOICEVOX Engine is running on the specified URL",
        args: {
          json: "Output in JSON format",
        },
      },
      setting: {
        name: "setting",
        description: "Display VOICEVOX Engine information",
        fetching: "Fetching engine information...",
        settingInfo: "Engine Information",
        settingData: "Engine Data",
        args: {
          json: "Output in JSON format",
        },
        errorFetching: "Error fetching engine information:",
        makeSureEngineRunning:
          "Make sure VOICEVOX Engine is running on the specified URL",
        update: {
          name: "update",
          description: "Update VOICEVOX Engine settings",
          success: "Settings updated successfully",
          updatedSettings: "Updated Settings",
          corsPolicyMode: "CORS Policy Mode",
          allowOrigin: "Allow Origin",
          args: {
            corsPolicyMode: "CORS policy mode (all or localapps)",
            allowOrigin: "Allowed origin (only when corsPolicyMode is all)",
          },
          errorUpdating: "Error updating settings:",
        },
      },
      presets: {
        name: "presets",
        description: "Preset-related commands",
        list: {
          name: "list",
          description: "List available presets",
          fetching: "Fetching available presets...",
          totalPresets: "Total {{count}} presets found",
          noPresets: "No presets found",
          args: {
            json: "Output in JSON format",
          },
          errorFetching: "Error fetching presets:",
          makeSureEngineRunning:
            "Make sure VOICEVOX Engine is running on the specified URL",
        },
        add: {
          name: "add",
          description: "Add a new preset",
          adding: "Adding preset: {{name}}",
          added: "Preset added: {{name}}",
          presetId: "Preset ID: {{id}}",
          args: {
            id: "Preset ID",
            name: "Preset name",
            speaker: "Speaker UUID",
            style: "Style ID",
            speed: "Speed scale",
            pitch: "Pitch scale",
            intonation: "Intonation scale",
            volume: "Volume scale",
            prePhonemeLength: "Pre-phoneme length",
            postPhonemeLength: "Post-phoneme length",
            json: "Output in JSON format",
          },
          errorAdding: "Error adding preset:",
          makeSureEngineRunning:
            "Make sure VOICEVOX Engine is running on the specified URL",
        },
        update: {
          name: "update",
          description: "Update an existing preset",
          updating: "Updating preset: ID {{id}}",
          updated: "Preset updated: ID {{id}}",
          args: {
            id: "Preset ID",
            name: "Preset name",
            speaker: "Speaker UUID",
            style: "Style ID",
            speed: "Speed scale",
            pitch: "Pitch scale",
            intonation: "Intonation scale",
            volume: "Volume scale",
            prePhonemeLength: "Pre-phoneme length",
            postPhonemeLength: "Post-phoneme length",
            json: "Output in JSON format",
          },
          errorUpdating: "Error updating preset:",
          makeSureEngineRunning:
            "Make sure VOICEVOX Engine is running on the specified URL",
        },
        delete: {
          name: "delete",
          description: "Delete an existing preset",
          deleting: "Deleting preset: ID {{id}}",
          deleted: "Preset deleted: ID {{id}}",
          args: {
            id: "Preset ID",
            json: "Output in JSON format",
          },
          errorDeleting: "Error deleting preset:",
          makeSureEngineRunning:
            "Make sure VOICEVOX Engine is running on the specified URL",
        },
      },
      version: {
        name: "version",
        description: "Show version information",
      },
      devices: {
        name: "devices",
        description: "Display supported devices list",
        fetching: "Fetching supported devices list...",
        devicesInfo: "Supported Devices Information",
        deviceName: "Device Name",
        deviceType: "Device Type",
        deviceId: "Device ID",
        deviceUuid: "Device UUID",
        deviceModel: "Device Model",
        deviceSpeaker: "Device Speaker",
        deviceSpeakerUuid: "Device Speaker UUID",
        deviceSpeakerName: "Device Speaker Name",
        deviceSpeakerSpeakerUuid: "Device Speaker Speaker UUID",
        deviceSpeakerSpeakerName: "Device Speaker Speaker Name",
        deviceSpeakerSpeakerStyleId: "Device Speaker Speaker Style ID",
        deviceSpeakerSpeakerStyleName: "Device Speaker Speaker Style Name",
        deviceSpeakerSpeakerVoiceSamples:
          "Device Speaker Speaker Voice Samples",
        args: {
          json: "Output in JSON format",
        },
        errorFetching: "Error fetching supported devices list:",
        makeSureEngineRunning:
          "Make sure VOICEVOX Engine is running on the specified URL",
      },
      engine: {
        name: "engine",
        description: "VOICEVOX Engine related commands",
        manifest: {
          name: "manifest",
          description: "Display VOICEVOX Engine manifest information",
          fetching: "Fetching engine manifest...",
          manifestInfo: "Engine Manifest Information",
          engineName: "Engine Name",
          brandName: "Brand Name",
          version: "Manifest Version",
          uuid: "Engine UUID",
          url: "Engine URL",
          defaultSamplingRate: "Default Sampling Rate",
          frameRate: "Frame Rate",
          supportedFeatures: "Supported Features",
          args: {
            json: "Output in JSON format",
          },
          errorFetching: "Error fetching engine manifest:",
          makeSureEngineRunning:
            "Make sure VOICEVOX Engine is running on the specified URL",
        },
        version: {
          name: "version",
          description: "Show VOICEVOX Engine version information",
          engineVersion: "VOICEVOX Engine Version: {{version}}",
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
      core: {
        name: "core",
        description: "VOICEVOX Core related commands",
        versions: {
          name: "versions",
          description: "Display available core versions",
          fetching: "Fetching core versions...",
          versionsFound: "Available core versions:",
          args: {
            json: "Output in JSON format",
          },
          errorFetching: "Error occurred while fetching core versions:",
          makeSureEngineRunning:
            "Make sure VOICEVOX Engine is running on the specified URL",
        },
      },
    },
    common: {
      error: "Error",
      unknown: "Unknown",
      args: {
        json: "Output in JSON format",
      },
    },
  },
};

// 現在のロケール
// const currentLocale = getLocale();

// 現在の翻訳データ
// const currentTranslations = translations[currentLocale];

/**
 * 利用可能なロケールを取得
 * @returns 利用可能なロケールの配列
 */
export const getSupportedLocales = (): readonly Locale[] => {
  return SUPPORTED_LOCALES;
};
