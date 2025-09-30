import { readFileSync, writeFileSync } from "node:fs";
import type { paths } from "@suzumiyaaoba/voicevox-client";
import type openapiFetch from "openapi-fetch";
import { t } from "@/i18n/index.js";
import { display, log } from "@/logger.js";
import { validateResponse } from "@/utils/api-helpers.js";
import { ErrorType, VoicevoxError } from "@/utils/error-handler.js";
import { outputJson } from "@/utils/output.js";
import { type AudioQuery, audioQueryDataSchema } from "@/utils/validation.js";

type Client = ReturnType<typeof openapiFetch<paths>>;

type MultiSynthesisOptions = {
  client: Client;
  audioQueries: AudioQuery[];
  speakerId: number;
  outputFile: string;
  outputFormat: "json" | "text";
  baseUrl: string;
  shouldPlay?: boolean;
};

type SingleSynthesisOptions = {
  client: Client;
  audioQuery: AudioQuery;
  speakerId: number;
  outputFile: string;
  outputFormat: "json" | "text";
  text?: string;
  input?: string;
  shouldPlay: boolean;
};

// マルチ合成を実行
export const executeMultiSynthesis = async (
  options: MultiSynthesisOptions,
): Promise<{ outputFile: string }> => {
  const { client, audioQueries, speakerId, outputFile, outputFormat, baseUrl } =
    options;

  log.debug("Making multi synthesis API request", {
    baseUrl,
    speaker: speakerId,
    count: audioQueries.length,
  });

  // /multi_synthesis エンドポイントを使用
  const multiSynthesisRes = await client.POST("/multi_synthesis", {
    params: { query: { speaker: speakerId } },
    body: audioQueries,
    parseAs: "arrayBuffer",
  });

  const zipData = validateResponse(
    multiSynthesisRes,
    "Multi synthesis failed: empty response",
    { speakerId, count: audioQueries.length },
  ) as ArrayBuffer;

  // ZIP形式で受け取った音声データを保存
  writeFileSync(outputFile, Buffer.from(zipData));

  if (outputFormat === "json") {
    outputJson({
      success: true,
      output: outputFile,
      speaker: speakerId,
      count: audioQueries.length,
      fileSize: zipData.byteLength,
      format: "zip",
    });
    return { outputFile };
  }

  display.info(
    t("commands.synthesis.multiSynthesisComplete", {
      count: String(audioQueries.length),
    }),
  );
  display.info(
    t("commands.synthesis.synthesisComplete", { output: outputFile }),
  );

  log.debug("Multi synthesis command completed successfully", {
    totalItems: audioQueries.length,
    outputFile,
  });

  return { outputFile };
};

// シングル合成を実行
export const executeSingleSynthesis = async (
  options: SingleSynthesisOptions,
): Promise<{ outputFile: string }> => {
  const {
    client,
    audioQuery,
    speakerId,
    outputFile,
    outputFormat,
    text,
    input,
    shouldPlay,
  } = options;

  // 音声合成を実行 (POST /synthesis?speaker) with audioQuery body
  const synthesisRes = await client.POST("/synthesis", {
    params: { query: { speaker: speakerId } },
    body: audioQuery,
    parseAs: "arrayBuffer",
  });
  const synthesisData = validateResponse(
    synthesisRes,
    "Synthesis failed: empty response",
    { speakerId, text },
  ) as ArrayBuffer;

  // 音声データをファイルに保存
  writeFileSync(outputFile, Buffer.from(synthesisData));

  // JSON形式で出力する場合
  if (outputFormat === "json") {
    const result = {
      success: true,
      output: outputFile,
      speaker: speakerId,
      text,
      input,
      audioQuery,
      fileSize: synthesisData.byteLength,
      play: shouldPlay,
    };
    outputJson(result);
    return { outputFile };
  }

  display.info(
    t("commands.synthesis.synthesisComplete", { output: outputFile }),
  );

  log.debug("Synthesis command completed successfully", {
    outputFile,
    played: shouldPlay,
  });

  return { outputFile };
};

// テキストから音声クエリを生成
export const createAudioQueryFromText = async (
  client: Client,
  text: string,
  speakerId: number,
  baseUrl: string,
): Promise<AudioQuery> => {
  log.debug("Making audio query API request", {
    baseUrl,
    speaker: speakerId,
    text,
  });

  const audioQueryRes = await client.POST("/audio_query", {
    params: { query: { speaker: speakerId, text } },
  });

  return validateResponse(audioQueryRes, "Audio query failed: empty response", {
    speakerId,
    text,
  });
};

// 複数のテキストから音声クエリを生成
export const createAudioQueriesFromLines = async (
  client: Client,
  lines: string[],
  speakerId: number,
  baseUrl: string,
): Promise<AudioQuery[]> => {
  const audioQueries: AudioQuery[] = [];

  for (const line of lines) {
    const audioQuery = await createAudioQueryFromText(
      client,
      line,
      speakerId,
      baseUrl,
    );
    audioQueries.push(audioQuery);
  }

  return audioQueries;
};

// 入力ファイルからテキスト行を読み込み
const parseTextFile = (fileContent: string): string[] => {
  return fileContent
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
};

// JSON配列ファイルからAudioQueryを読み込み
const parseJsonArrayFile = (fileContent: string): AudioQuery[] => {
  const parsedData = JSON.parse(fileContent);

  if (!Array.isArray(parsedData)) {
    throw new Error("Expected JSON array");
  }

  return parsedData.map((item) => audioQueryDataSchema.parse(item));
};

// JSONオブジェクトファイルからAudioQueryを読み込み
const parseJsonObjectFile = (fileContent: string): AudioQuery => {
  const parsedData = JSON.parse(fileContent);
  return audioQueryDataSchema.parse(parsedData);
};

type InputFileResult =
  | { type: "multi"; audioQueries: AudioQuery[] }
  | { type: "single"; audioQuery: AudioQuery }
  | { type: "text-multi"; lines: string[] }
  | { type: "text-single"; text: string };

// 入力ファイルを処理
export const processInputFile = (inputFile: string): InputFileResult => {
  log.debug("Loading input file", { inputFile });

  const fileContent = readFileSync(inputFile, "utf-8");

  // まずJSONとしてパースを試みる
  try {
    const parsedData = JSON.parse(fileContent);

    // 配列の場合はmulti mode用のaudio queriesとして処理
    if (Array.isArray(parsedData)) {
      const audioQueries = parseJsonArrayFile(fileContent);
      return { type: "multi", audioQueries };
    }

    // オブジェクトの場合は単一のaudio queryとして処理
    const audioQuery = parseJsonObjectFile(fileContent);
    return { type: "single", audioQuery };
  } catch {
    // JSONパースに失敗した場合、テキストファイルとして処理
    log.debug("Input file is not JSON, treating as text file", { inputFile });

    const lines = parseTextFile(fileContent);

    if (lines.length > 1) {
      return { type: "text-multi", lines };
    }

    if (lines.length === 1) {
      return { type: "text-single", text: lines[0] ?? "" };
    }

    throw new VoicevoxError(
      "Input file is empty",
      ErrorType.VALIDATION,
      undefined,
      { inputFile },
    );
  }
};

// マルチモード（--multi オプション）での入力ファイル処理
export const processMultiModeInput = (inputFile: string): AudioQuery[] => {
  try {
    const fileContent = readFileSync(inputFile, "utf-8");
    const parsedData = JSON.parse(fileContent);

    // 配列かどうかチェック
    if (!Array.isArray(parsedData)) {
      throw new Error("Multi mode requires an array of audio queries");
    }

    // 各要素をバリデーション
    return parsedData.map((item) => audioQueryDataSchema.parse(item));
  } catch (error) {
    throw new VoicevoxError(
      `Failed to read or parse multi input file: ${error instanceof Error ? error.message : "Unknown error"}`,
      ErrorType.VALIDATION,
      undefined,
      { inputFile },
    );
  }
};
