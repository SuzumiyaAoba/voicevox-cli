import i18next from "i18next";
import { getLocale } from "./index.js";

// 翻訳データ
const resources = {
  ja: {
    translation: {
      commands: {
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
          deviceSpeakerSpeakerStyleName:
            "デバイススピーカースピーカースタイル名",
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
            errorFetching:
              "エンジンマニフェストの取得中にエラーが発生しました:",
            makeSureEngineRunning:
              "指定されたURLでVOICEVOX Engineが起動していることを確認してください",
          },
        },
      },
    },
  },
  en: {
    translation: {
      commands: {
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
        },
      },
    },
  },
};

// i18nextの初期化
i18next.init({
  lng: getLocale(), // 現在のロケールを使用
  fallbackLng: "en",
  resources,
  interpolation: {
    escapeValue: false, // Reactは使用していないのでfalse
  },
  debug: false, // デバッグを無効にする
});

export default i18next;
