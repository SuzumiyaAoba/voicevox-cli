/**
 * 音声合成コマンドのテスト
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { synthesisCommand } from "./index.js";
import { createClient } from "@/utils/api-helpers.js";
import { playAudio } from "@/utils/audio-player.js";
import { handleError } from "@/utils/error-handler.js";
import { resolveOutputFormat } from "@/utils/output.js";
import { validateArgs } from "@/utils/validation.js";
import {
  createAudioQueryFromText,
  executeMultiSynthesis,
  executeSingleSynthesis,
  processInputFile,
  processMultiModeInput,
} from "./handlers.js";

// モックの設定
vi.mock("@/utils/api-helpers.js", () => ({
  createClient: vi.fn(),
}));

vi.mock("@/utils/audio-player.js", () => ({
  playAudio: vi.fn(),
}));

vi.mock("@/utils/error-handler.js", () => ({
  handleError: vi.fn(),
}));

vi.mock("@/utils/messages.js", () => ({
  synthesisMessages: {
    showLoadingInput: vi.fn(),
    showSpeaker: vi.fn(),
    showOutput: vi.fn(),
    showPlayFlag: vi.fn(),
    showLoadingMultiInput: vi.fn(),
    showLoadingMultiText: vi.fn(),
    showPlaying: vi.fn(),
  },
}));

vi.mock("@/utils/output.js", () => ({
  resolveOutputFormat: vi.fn(),
}));

vi.mock("@/utils/validation.js", () => ({
  validateArgs: vi.fn(),
  baseUrlSchema: { optional: () => ({}) },
  speakerIdSchema: {},
  textSchema: { optional: () => ({}) },
  inputFileSchema: { optional: () => ({}) },
  outputFileSchema: { optional: () => ({}) },
  outputTypeSchema: { optional: () => ({}) },
}));

vi.mock("@/utils/zip-player.js", () => ({
  extractAndPlayZip: vi.fn(),
}));

vi.mock("./handlers.js", () => ({
  createAudioQueriesFromLines: vi.fn(),
  createAudioQueryFromText: vi.fn(),
  executeMultiSynthesis: vi.fn(),
  executeSingleSynthesis: vi.fn(),
  processInputFile: vi.fn(),
  processMultiModeInput: vi.fn(),
}));

vi.mock("@/logger.js", () => ({
  display: {
    info: vi.fn(),
  },
  log: {
    debug: vi.fn(),
  },
}));

vi.mock("@/i18n/config.js", () => ({
  t: vi.fn((key: string, params?: Record<string, unknown>) => {
    const translations: Record<string, string> = {
      "commands.synthesis.name": "synthesis",
      "commands.synthesis.description": "Synthesize speech from text",
      "commands.synthesis.args.text": "Text to synthesize",
      "commands.synthesis.args.speaker": "Speaker ID",
      "commands.synthesis.args.input": "Input file",
      "commands.synthesis.args.output": "Output file",
      "commands.synthesis.args.play": "Play audio after synthesis",
      "commands.synthesis.args.type": "Output type",
      "commands.synthesis.args.multi": "Multi-mode synthesis",
      "commands.synthesis.synthesizing": `Synthesizing: ${params?.["text"] || ""}`,
    };
    return translations[key] || key;
  }),
}));

describe("synthesisCommand", () => {
  const mockClient = {
    GET: vi.fn(),
    POST: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (createClient as any).mockReturnValue(mockClient);
    (resolveOutputFormat as any).mockReturnValue("text");
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("コマンドのメタデータが正しく設定されている", () => {
    expect(synthesisCommand.meta).toBeDefined();
    expect((synthesisCommand as any).meta.name).toBe("synthesis");
    expect((synthesisCommand as any).meta.description).toBe("Synthesize speech from text");
  });

  it("基本的な引数が正しく設定されている", () => {
    expect(synthesisCommand.args).toHaveProperty("text");
    expect(synthesisCommand.args).toHaveProperty("speaker");
    expect(synthesisCommand.args).toHaveProperty("input");
    expect(synthesisCommand.args).toHaveProperty("output");
    expect(synthesisCommand.args).toHaveProperty("play");
    expect(synthesisCommand.args).toHaveProperty("type");
    expect(synthesisCommand.args).toHaveProperty("multi");
  });

  it("テキストから音声合成を実行する", async () => {
    const mockAudioQuery = { text: "こんにちは", speaker: 2 };
    const validatedArgs = {
      text: "こんにちは",
      speaker: "2",
      baseUrl: "http://localhost:50021",
      output: "output.wav",
      play: false,
    };

    (validateArgs as any).mockReturnValue(validatedArgs);
    (createAudioQueryFromText as any).mockResolvedValue(mockAudioQuery);
    (executeSingleSynthesis as any).mockResolvedValue(undefined);

    const args = {
      text: "こんにちは",
      speaker: "2",
      baseUrl: "http://localhost:50021",
      type: "text",
      output: "output.wav",
      input: "input.txt",
      json: false,
      play: false,
      multi: false,
      _: []
    };

    await synthesisCommand.run!({ args, rawArgs: [], cmd: synthesisCommand });

    expect(validateArgs).toHaveBeenCalledWith(expect.any(Object), args);
    expect(createClient).toHaveBeenCalledWith("http://localhost:50021");
    expect(createAudioQueryFromText).toHaveBeenCalledWith(
      mockClient,
      "こんにちは",
      2,
      "http://localhost:50021"
    );
    expect(executeSingleSynthesis).toHaveBeenCalledWith(
      expect.objectContaining({
        client: mockClient,
        audioQuery: mockAudioQuery,
        speakerId: 2,
        outputFile: "output.wav",
        outputFormat: "text",
        text: "こんにちは",
        shouldPlay: false,
      })
    );
  });

  it("マルチモードで音声合成を実行する", async () => {
    const mockAudioQueries = [
      { text: "テキスト1", speaker: 2 },
      { text: "テキスト2", speaker: 2 },
    ];
    const validatedArgs = {
      text: "",
      speaker: "2",
      input: "input.txt",
      multi: true,
      baseUrl: "http://localhost:50021",
      output: "output.zip",
      play: false,
    };

    (validateArgs as any).mockReturnValue(validatedArgs);
    (processMultiModeInput as any).mockReturnValue(mockAudioQueries);
    (executeMultiSynthesis as any).mockResolvedValue({
      outputFile: "output.zip",
    });

    const args = {
      text: "こんにちは",
      speaker: "2",
      input: "input.txt",
      multi: true,
      baseUrl: "http://localhost:50021",
      type: "text",
      output: "output.wav",
      json: false,
      play: false,
      _: []
    };

    await synthesisCommand.run!({ args, rawArgs: [], cmd: synthesisCommand });

    expect(processMultiModeInput).toHaveBeenCalledWith("input.txt");
    expect(executeMultiSynthesis).toHaveBeenCalledWith(
      expect.objectContaining({
        client: mockClient,
        audioQueries: mockAudioQueries,
        speakerId: 2,
        outputFile: "output.zip",
        outputFormat: "text",
        baseUrl: "http://localhost:50021",
        shouldPlay: false,
      })
    );
  });

  it("再生オプション付きで音声合成を実行する", async () => {
    const mockAudioQuery = { text: "こんにちは", speaker: 2 };
    const validatedArgs = {
      text: "こんにちは",
      speaker: "2",
      baseUrl: "http://localhost:50021",
      output: "output.wav",
      play: true,
    };

    (validateArgs as any).mockReturnValue(validatedArgs);
    (createAudioQueryFromText as any).mockResolvedValue(mockAudioQuery);
    (executeSingleSynthesis as any).mockResolvedValue(undefined);
    (playAudio as any).mockResolvedValue(undefined);

    const args = {
      text: "こんにちは",
      speaker: "2",
      baseUrl: "http://localhost:50021",
      play: true,
      type: "text",
      output: "output.wav",
      input: "input.txt",
      json: false,
      multi: false,
      _: []
    };

    await synthesisCommand.run!({ args, rawArgs: [], cmd: synthesisCommand });

    expect(executeSingleSynthesis).toHaveBeenCalledWith(
      expect.objectContaining({
        shouldPlay: true,
      })
    );
    expect(playAudio).toHaveBeenCalledWith("output.wav");
  });

  it("入力ファイルから音声合成を実行する", async () => {
    const mockResult = {
      type: "single" as const,
      audioQuery: { text: "ファイルから読み込み", speaker: 2 },
    };
    const validatedArgs = {
      text: "",
      speaker: "2",
      input: "input.json",
      baseUrl: "http://localhost:50021",
      output: "output.wav",
      play: false,
    };

    (validateArgs as any).mockReturnValue(validatedArgs);
    (processInputFile as any).mockReturnValue(mockResult);
    (executeSingleSynthesis as any).mockResolvedValue(undefined);

    const args = {
      text: "こんにちは",
      speaker: "2",
      input: "input.json",
      baseUrl: "http://localhost:50021",
      type: "text",
      output: "output.wav",
      json: false,
      play: false,
      multi: false,
      _: []
    };

    await synthesisCommand.run!({ args, rawArgs: [], cmd: synthesisCommand });

    expect(processInputFile).toHaveBeenCalledWith("input.json");
    expect(executeSingleSynthesis).toHaveBeenCalledWith(
      expect.objectContaining({
        client: mockClient,
        audioQuery: mockResult.audioQuery,
        speakerId: 2,
        outputFile: "output.wav",
        outputFormat: "text",
        input: "input.json",
        shouldPlay: false,
      })
    );
  });

  it("エラーが発生した場合にhandleErrorを呼ぶ", async () => {
    const error = new Error("Synthesis error");
    const mockFn = vi.fn().mockRejectedValue(error);
    (createAudioQueryFromText as any).mockImplementation(mockFn);

    const validatedArgs = {
      text: "こんにちは",
      speaker: "2",
      baseUrl: "http://localhost:50021",
    };
    (validateArgs as any).mockReturnValue(validatedArgs);

    const args = {
      text: "こんにちは",
      speaker: "2",
      baseUrl: "http://localhost:50021",
      type: "text",
      output: "output.wav",
      input: "input.txt",
      json: false,
      play: false,
      multi: false,
      _: []
    };

    await synthesisCommand.run!({ args, rawArgs: [], cmd: synthesisCommand });

    expect(handleError).toHaveBeenCalledWith(error, "synthesis", {
      speaker: "2",
      text: "こんにちは",
      input: undefined,
      output: undefined,
      baseUrl: "http://localhost:50021",
    });
  });

  it("JSON形式で出力する", async () => {
    const mockAudioQuery = { text: "こんにちは", speaker: 2 };
    const validatedArgs = {
      text: "こんにちは",
      speaker: "2",
      baseUrl: "http://localhost:50021",
      json: true,
    };

    (validateArgs as any).mockReturnValue(validatedArgs);
    (createAudioQueryFromText as any).mockResolvedValue(mockAudioQuery);
    (executeSingleSynthesis as any).mockResolvedValue(undefined);
    (resolveOutputFormat as any).mockReturnValue("json");

    const args = {
      text: "こんにちは",
      speaker: "2",
      baseUrl: "http://localhost:50021",
      json: true,
      type: "text",
      output: "output.wav",
      input: "input.txt",
      play: false,
      multi: false,
      _: []
    };

    await synthesisCommand.run!({ args, rawArgs: [], cmd: synthesisCommand });

    expect(resolveOutputFormat).toHaveBeenCalledWith(undefined, true);
    expect(executeSingleSynthesis).toHaveBeenCalledWith(
      expect.objectContaining({
        outputFormat: "json",
      })
    );
  });

  it("デフォルトのベースURLが使用される", async () => {
    const mockAudioQuery = { text: "こんにちは", speaker: 2 };
    const validatedArgs = {
      text: "こんにちは",
      speaker: "2",
      baseUrl: "http://localhost:50021",
      output: "output.wav",
      play: false,
    };

    (validateArgs as any).mockReturnValue(validatedArgs);
    (createAudioQueryFromText as any).mockResolvedValue(mockAudioQuery);
    (executeSingleSynthesis as any).mockResolvedValue(undefined);

    const args = {
      text: "こんにちは",
      speaker: "2",
      baseUrl: "http://localhost:50021",
      type: "text",
      output: "output.wav",
      input: "input.txt",
      json: false,
      play: false,
      multi: false,
      _: []
    };

    await synthesisCommand.run!({ args, rawArgs: [], cmd: synthesisCommand });

    expect(createClient).toHaveBeenCalledWith("http://localhost:50021");
  });
});
