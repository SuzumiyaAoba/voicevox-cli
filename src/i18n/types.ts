/**
 * i18n型定義
 *
 * 翻訳キーの型安全性を提供するための型定義ファイル。
 * 翻訳データの構造に基づいて型安全なキーを生成します。
 *
 * @module i18n/types
 */

/**
 * 翻訳データの型
 *
 * 実際の翻訳データの型を定義します。
 */
export type TranslationData = {
  commands: {
    synthesis: {
      name: string;
      description: string;
      synthesizing: string;
      loadingInput: string;
      loadingMultiInput: string;
      loadingMultiText: string;
      speakerId: string;
      output: string;
      play: string;
      args: {
        text: string;
        speaker: string;
        input: string;
        output: string;
        play: string;
        type: string;
        multi: string;
      };
      synthesisError: string;
      synthesisComplete: string;
      multiSynthesisComplete: string;
      playingAudio: string;
      playingMultipleAudio: string;
      playingAudioFile: string;
      noAudioFilesInZip: string;
      makeSureEngineRunning: string;
      playerNotFound: string;
      playerError: string;
    };
    query: {
      name: string;
      description: string;
      create: {
        name: string;
        description: string;
        querying: string;
        speakerId: string;
        usingPreset: string;
        args: {
          text: string;
          speaker: string;
          enableKatakanaEnglish: string;
          presetId: string;
          json: string;
        };
        queryError: string;
        queryComplete: string;
        queryResult: string;
        makeSureEngineRunning: string;
        audioQueryInfo: {
          title: string;
          speed: string;
          pitch: string;
          intonation: string;
          volume: string;
          prePhonemeLength: string;
          postPhonemeLength: string;
          sampling: string;
          stereo: string;
          kana: string;
          on: string;
          off: string;
          accentPhrases: string;
          accent: string;
        };
      };
    };
    speakers: {
      name: string;
      description: string;
      fetching: string;
      totalSpeakers: string;
      invalidResponse: string;
      errorFetching: string;
      makeSureEngineRunning: string;
      args: {
        json: string;
      };
      tableHeaders: {
        name: string;
        uuid: string;
        styleName: string;
        styleId: string;
      };
    };
    setting: {
      name: string;
      description: string;
      fetching: string;
      settingInfo: string;
      settingData: string;
      args: {
        json: string;
      };
      errorFetching: string;
      makeSureEngineRunning: string;
      update: {
        name: string;
        description: string;
        success: string;
        updatedSettings: string;
        corsPolicyMode: string;
        allowOrigin: string;
        args: {
          corsPolicyMode: string;
          allowOrigin: string;
        };
        errorUpdating: string;
      };
    };
    presets: {
      name: string;
      description: string;
      list: {
        name: string;
        description: string;
        fetching: string;
        totalPresets: string;
        noPresets: string;
        args: {
          json: string;
        };
        errorFetching: string;
        makeSureEngineRunning: string;
        defaultName: string;
        labels: {
          id: string;
          speakerUuid: string;
          styleId: string;
          speed: string;
          pitch: string;
          intonation: string;
          volume: string;
          prePhonemeLength: string;
          postPhonemeLength: string;
        };
      };
      add: {
        name: string;
        description: string;
        adding: string;
        added: string;
        presetId: string;
        args: {
          id: string;
          name: string;
          speaker: string;
          style: string;
          speed: string;
          pitch: string;
          intonation: string;
          volume: string;
          prePhonemeLength: string;
          postPhonemeLength: string;
          json: string;
        };
        errorAdding: string;
        makeSureEngineRunning: string;
      };
      update: {
        name: string;
        description: string;
        updating: string;
        updated: string;
        args: {
          id: string;
          name: string;
          speaker: string;
          style: string;
          speed: string;
          pitch: string;
          intonation: string;
          volume: string;
          prePhonemeLength: string;
          postPhonemeLength: string;
          json: string;
        };
        errorUpdating: string;
        makeSureEngineRunning: string;
      };
      delete: {
        name: string;
        description: string;
        deleting: string;
        deleted: string;
        args: {
          id: string;
          json: string;
        };
        errorDeleting: string;
        makeSureEngineRunning: string;
      };
    };
    version: {
      name: string;
      description: string;
    };
    devices: {
      name: string;
      description: string;
      fetching: string;
      devicesInfo: string;
      deviceName: string;
      deviceType: string;
      deviceId: string;
      deviceUuid: string;
      deviceModel: string;
      deviceSpeaker: string;
      deviceSpeakerUuid: string;
      deviceSpeakerName: string;
      deviceSpeakerSpeakerUuid: string;
      deviceSpeakerSpeakerName: string;
      deviceSpeakerSpeakerStyleId: string;
      deviceSpeakerSpeakerStyleName: string;
      deviceSpeakerSpeakerVoiceSamples: string;
      args: {
        json: string;
      };
      errorFetching: string;
      makeSureEngineRunning: string;
      noDeviceInfo: string;
    };
    engine: {
      name: string;
      description: string;
      manifest: {
        name: string;
        description: string;
        fetching: string;
        manifestInfo: string;
        engineName: string;
        brandName: string;
        version: string;
        uuid: string;
        url: string;
        defaultSamplingRate: string;
        frameRate: string;
        supportedFeatures: string;
        args: {
          json: string;
        };
        errorFetching: string;
        makeSureEngineRunning: string;
      };
      version: {
        name: string;
        description: string;
        engineVersion: string;
        invalidResponse: string;
        errorFetching: string;
        makeSureEngineRunning: string;
        unknownError: string;
        args: {
          json: string;
        };
      };
    };
    core: {
      name: string;
      description: string;
      versions: {
        name: string;
        description: string;
        args: {
          json: string;
        };
        errorFetching: string;
        makeSureEngineRunning: string;
      };
    };
  };
  common: {
    error: string;
    unknown: string;
    args: {
      json: string;
    };
  };
  errors: {
    network: string;
    api: string;
    validation: string;
    unknown: string;
    help: {
      network: string;
      api: string;
      validation: string;
    };
  };
};

/**
 * 型安全な翻訳キー
 *
 * 翻訳データから生成される型安全なキーパス。
 */
export type TranslationKey =
  | "commands.synthesis.name"
  | "commands.synthesis.description"
  | "commands.synthesis.synthesizing"
  | "commands.synthesis.loadingInput"
  | "commands.synthesis.loadingMultiInput"
  | "commands.synthesis.loadingMultiText"
  | "commands.synthesis.speakerId"
  | "commands.synthesis.output"
  | "commands.synthesis.play"
  | "commands.synthesis.args.text"
  | "commands.synthesis.args.speaker"
  | "commands.synthesis.args.input"
  | "commands.synthesis.args.output"
  | "commands.synthesis.args.play"
  | "commands.synthesis.args.type"
  | "commands.synthesis.args.multi"
  | "commands.synthesis.synthesisError"
  | "commands.synthesis.synthesisComplete"
  | "commands.synthesis.multiSynthesisComplete"
  | "commands.synthesis.playingAudio"
  | "commands.synthesis.playingMultipleAudio"
  | "commands.synthesis.playingAudioFile"
  | "commands.synthesis.noAudioFilesInZip"
  | "commands.synthesis.makeSureEngineRunning"
  | "commands.synthesis.playerNotFound"
  | "commands.synthesis.playerError"
  | "commands.query.name"
  | "commands.query.description"
  | "commands.query.create.name"
  | "commands.query.create.description"
  | "commands.query.create.querying"
  | "commands.query.create.speakerId"
  | "commands.query.create.usingPreset"
  | "commands.query.create.args.text"
  | "commands.query.create.args.speaker"
  | "commands.query.create.args.enableKatakanaEnglish"
  | "commands.query.create.args.presetId"
  | "commands.query.create.args.json"
  | "commands.query.create.queryError"
  | "commands.query.create.queryComplete"
  | "commands.query.create.queryResult"
  | "commands.query.create.makeSureEngineRunning"
  | "commands.query.audioQueryInfo.title"
  | "commands.query.audioQueryInfo.speed"
  | "commands.query.audioQueryInfo.pitch"
  | "commands.query.audioQueryInfo.intonation"
  | "commands.query.audioQueryInfo.volume"
  | "commands.query.audioQueryInfo.prePhonemeLength"
  | "commands.query.audioQueryInfo.postPhonemeLength"
  | "commands.query.audioQueryInfo.sampling"
  | "commands.query.audioQueryInfo.stereo"
  | "commands.query.audioQueryInfo.kana"
  | "commands.query.audioQueryInfo.on"
  | "commands.query.audioQueryInfo.off"
  | "commands.query.audioQueryInfo.accentPhrases"
  | "commands.query.audioQueryInfo.accent"
  | "commands.speakers.name"
  | "commands.speakers.description"
  | "commands.speakers.fetching"
  | "commands.speakers.totalSpeakers"
  | "commands.speakers.invalidResponse"
  | "commands.speakers.errorFetching"
  | "commands.speakers.makeSureEngineRunning"
  | "commands.speakers.args.json"
  | "commands.speakers.tableHeaders.name"
  | "commands.speakers.tableHeaders.uuid"
  | "commands.speakers.tableHeaders.styleName"
  | "commands.speakers.tableHeaders.styleId"
  | "commands.setting.name"
  | "commands.setting.description"
  | "commands.setting.fetching"
  | "commands.setting.settingInfo"
  | "commands.setting.settingData"
  | "commands.setting.args.json"
  | "commands.setting.errorFetching"
  | "commands.setting.makeSureEngineRunning"
  | "commands.setting.update.name"
  | "commands.setting.update.description"
  | "commands.setting.update.success"
  | "commands.setting.update.updatedSettings"
  | "commands.setting.update.corsPolicyMode"
  | "commands.setting.update.allowOrigin"
  | "commands.setting.update.args.corsPolicyMode"
  | "commands.setting.update.args.allowOrigin"
  | "commands.setting.update.errorUpdating"
  | "commands.presets.name"
  | "commands.presets.description"
  | "commands.presets.list.name"
  | "commands.presets.list.description"
  | "commands.presets.list.fetching"
  | "commands.presets.list.totalPresets"
  | "commands.presets.list.noPresets"
  | "commands.presets.list.args.json"
  | "commands.presets.list.errorFetching"
  | "commands.presets.list.makeSureEngineRunning"
  | "commands.presets.list.defaultName"
  | "commands.presets.list.labels.id"
  | "commands.presets.list.labels.speakerUuid"
  | "commands.presets.list.labels.styleId"
  | "commands.presets.list.labels.speed"
  | "commands.presets.list.labels.pitch"
  | "commands.presets.list.labels.intonation"
  | "commands.presets.list.labels.volume"
  | "commands.presets.list.labels.prePhonemeLength"
  | "commands.presets.list.labels.postPhonemeLength"
  | "commands.presets.add.name"
  | "commands.presets.add.description"
  | "commands.presets.add.adding"
  | "commands.presets.add.added"
  | "commands.presets.add.presetId"
  | "commands.presets.add.args.id"
  | "commands.presets.add.args.name"
  | "commands.presets.add.args.speaker"
  | "commands.presets.add.args.style"
  | "commands.presets.add.args.speed"
  | "commands.presets.add.args.pitch"
  | "commands.presets.add.args.intonation"
  | "commands.presets.add.args.volume"
  | "commands.presets.add.args.prePhonemeLength"
  | "commands.presets.add.args.postPhonemeLength"
  | "commands.presets.add.args.json"
  | "commands.presets.add.errorAdding"
  | "commands.presets.add.makeSureEngineRunning"
  | "commands.presets.update.name"
  | "commands.presets.update.description"
  | "commands.presets.update.updating"
  | "commands.presets.update.updated"
  | "commands.presets.update.args.id"
  | "commands.presets.update.args.name"
  | "commands.presets.update.args.speaker"
  | "commands.presets.update.args.style"
  | "commands.presets.update.args.speed"
  | "commands.presets.update.args.pitch"
  | "commands.presets.update.args.intonation"
  | "commands.presets.update.args.volume"
  | "commands.presets.update.args.prePhonemeLength"
  | "commands.presets.update.args.postPhonemeLength"
  | "commands.presets.update.args.json"
  | "commands.presets.update.errorUpdating"
  | "commands.presets.update.makeSureEngineRunning"
  | "commands.presets.delete.name"
  | "commands.presets.delete.description"
  | "commands.presets.delete.deleting"
  | "commands.presets.delete.deleted"
  | "commands.presets.delete.args.id"
  | "commands.presets.delete.args.json"
  | "commands.presets.delete.errorDeleting"
  | "commands.presets.delete.makeSureEngineRunning"
  | "commands.version.name"
  | "commands.version.description"
  | "commands.devices.name"
  | "commands.devices.description"
  | "commands.devices.fetching"
  | "commands.devices.devicesInfo"
  | "commands.devices.deviceName"
  | "commands.devices.deviceType"
  | "commands.devices.deviceId"
  | "commands.devices.deviceUuid"
  | "commands.devices.deviceModel"
  | "commands.devices.deviceSpeaker"
  | "commands.devices.deviceSpeakerUuid"
  | "commands.devices.deviceSpeakerName"
  | "commands.devices.deviceSpeakerSpeakerUuid"
  | "commands.devices.deviceSpeakerSpeakerName"
  | "commands.devices.deviceSpeakerSpeakerStyleId"
  | "commands.devices.deviceSpeakerSpeakerStyleName"
  | "commands.devices.deviceSpeakerSpeakerVoiceSamples"
  | "commands.devices.args.json"
  | "commands.devices.errorFetching"
  | "commands.devices.makeSureEngineRunning"
  | "commands.devices.noDeviceInfo"
  | "commands.engine.name"
  | "commands.engine.description"
  | "commands.engine.manifest.name"
  | "commands.engine.manifest.description"
  | "commands.engine.manifest.fetching"
  | "commands.engine.manifest.manifestInfo"
  | "commands.engine.manifest.engineName"
  | "commands.engine.manifest.brandName"
  | "commands.engine.manifest.version"
  | "commands.engine.manifest.uuid"
  | "commands.engine.manifest.url"
  | "commands.engine.manifest.defaultSamplingRate"
  | "commands.engine.manifest.frameRate"
  | "commands.engine.manifest.supportedFeatures"
  | "commands.engine.manifest.args.json"
  | "commands.engine.manifest.errorFetching"
  | "commands.engine.manifest.makeSureEngineRunning"
  | "commands.engine.version.name"
  | "commands.engine.version.description"
  | "commands.engine.version.engineVersion"
  | "commands.engine.version.invalidResponse"
  | "commands.engine.version.errorFetching"
  | "commands.engine.version.makeSureEngineRunning"
  | "commands.engine.version.unknownError"
  | "commands.engine.version.args.json"
  | "commands.core.name"
  | "commands.core.description"
  | "commands.core.versions.name"
  | "commands.core.versions.description"
  | "commands.core.versions.args.json"
  | "commands.core.versions.errorFetching"
  | "commands.core.versions.makeSureEngineRunning"
  | "common.error"
  | "common.unknown"
  | "common.args.json"
  | "errors.network"
  | "errors.api"
  | "errors.validation"
  | "errors.unknown"
  | "errors.help.network"
  | "errors.help.api"
  | "errors.help.validation";

/**
 * 翻訳パラメータの型
 *
 * 翻訳文字列に渡すことができるパラメータの型。
 */
export type TranslationParams = Record<string, string | number>;
