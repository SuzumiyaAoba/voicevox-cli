import { spawn } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { defineCommand } from "citty";
import { t } from "@/i18n/index.js";
import { display, log } from "@/logger.js";
import { baseUrlOption } from "@/options.js";
import { createClient, validateResponse } from "@/utils/api-helpers.js";
import {
  ErrorType,
  handleError,
  VoicevoxError,
} from "@/utils/error-handler.js";
import { outputJson, resolveOutputFormat } from "@/utils/output.js";
import {
  type AudioQuery,
  audioQueryDataSchema,
  synthesisSchema,
  validateArgs,
} from "@/utils/validation.js";

// 音声ファイルを再生する関数
const playAudio = (filePath: string): Promise<void> => {
  return new Promise((resolve) => {
    // プラットフォームに応じて適切なプレイヤーを選択
    let player: string;
    let args: string[];

    if (process.platform === "darwin") {
      // macOS
      player = "afplay";
      args = [filePath];
    } else if (process.platform === "win32") {
      // Windows
      player = "powershell";
      args = ["-c", `(New-Object Media.SoundPlayer '${filePath}').PlaySync()`];
    } else {
      // Linux
      player = "aplay";
      args = [filePath];
    }

    const child = spawn(player, args, { stdio: "ignore" });

    child.on("error", (error) => {
      log.warn("Audio player not found or failed", { error: error.message });
      display.warn(t("commands.synthesis.playerNotFound"));
      resolve(); // エラーでも処理を続行
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        log.warn("Audio player exited with code", { code });
        display.warn(t("commands.synthesis.playerError"));
        resolve(); // エラーでも処理を続行
      }
    });
  });
};

// 音声合成コマンド
export const synthesisCommand = defineCommand({
  meta: {
    name: t("commands.synthesis.name"),
    description: t("commands.synthesis.description"),
  },
  args: {
    text: {
      type: "positional",
      description: t("commands.synthesis.args.text"),
      required: false,
    },
    speaker: {
      type: "string",
      description: t("commands.synthesis.args.speaker"),
      alias: "s",
      default: "2",
    },
    input: {
      type: "string",
      description: t("commands.synthesis.args.input"),
      alias: "i",
    },
    output: {
      type: "string",
      description: t("commands.synthesis.args.output"),
      alias: "o",
    },
    play: {
      type: "boolean",
      description: t("commands.synthesis.args.play"),
    },
    type: {
      type: "string",
      description: t("commands.synthesis.args.type"),
      alias: "t",
      choices: ["json", "text"],
    },
    json: {
      type: "boolean",
      description: t("commands.synthesis.args.json"),
      alias: "j",
    },
    multi: {
      type: "boolean",
      description: t("commands.synthesis.args.multi"),
      alias: "m",
    },
    ...baseUrlOption,
  },
  async run({ args }) {
    // 引数のバリデーション
    const validatedArgs = validateArgs(synthesisSchema, args);

    log.debug("Starting synthesis command", {
      text: validatedArgs.text,
      input: validatedArgs.input,
      speaker: validatedArgs.speaker,
      output: validatedArgs.output,
      play: validatedArgs.play,
      baseUrl: validatedArgs.baseUrl,
    });

    if (validatedArgs.text) {
      display.info(
        t("commands.synthesis.synthesizing", { text: validatedArgs.text }),
      );
    } else if (validatedArgs.input) {
      display.info(
        t("commands.synthesis.loadingInput", { input: validatedArgs.input }),
      );
    }
    display.info(
      t("commands.synthesis.speakerId", { speaker: validatedArgs.speaker }),
    );
    display.info(
      t("commands.synthesis.output", {
        output: validatedArgs.output || "output.wav",
      }),
    );
    display.info(
      t("commands.synthesis.play", {
        play: String(validatedArgs.play || false),
      }),
    );

    log.debug("Synthesis command parameters processed", {
      speakerId: validatedArgs.speaker,
      outputFile: validatedArgs.output || "output.wav",
      shouldPlay: validatedArgs.play || false,
    });

    try {
      const client = createClient(validatedArgs.baseUrl);

      // マルチモードの処理
      if (validatedArgs.multi && validatedArgs.input) {
        display.info(
          t("commands.synthesis.loadingMultiInput", {
            input: validatedArgs.input,
          }),
        );

        const speakerId = Number(validatedArgs.speaker);
        let audioQueries: AudioQuery[];

        try {
          const fileContent = readFileSync(validatedArgs.input, "utf-8");
          const parsedData = JSON.parse(fileContent);

          // 配列かどうかチェック
          if (!Array.isArray(parsedData)) {
            throw new Error("Multi mode requires an array of audio queries");
          }

          // 各要素をバリデーション
          audioQueries = parsedData.map((item) =>
            audioQueryDataSchema.parse(item),
          );
        } catch (error) {
          throw new VoicevoxError(
            `Failed to read or parse multi input file: ${error instanceof Error ? error.message : "Unknown error"}`,
            ErrorType.VALIDATION,
            undefined,
            { inputFile: validatedArgs.input },
          );
        }

        log.debug("Making multi synthesis API request", {
          baseUrl: validatedArgs.baseUrl,
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
        );

        // ZIP形式で受け取った音声データを保存
        const outputFile = validatedArgs.output || "output/multi_synthesis.zip";
        writeFileSync(outputFile, Buffer.from(zipData));

        const outputFormat = resolveOutputFormat(
          validatedArgs.type,
          validatedArgs.json,
        );

        if (outputFormat === "json") {
          outputJson({
            success: true,
            output: outputFile,
            speaker: speakerId,
            count: audioQueries.length,
            fileSize: zipData.byteLength,
            format: "zip",
          });
          return;
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

        return;
      }

      // シングルモードの処理
      const speakerId = Number(validatedArgs.speaker);
      let audioQuery: AudioQuery;

      if (validatedArgs.input) {
        // ファイルから読み込み
        log.debug("Loading input file", {
          inputFile: validatedArgs.input,
        });

        const fileContent = readFileSync(validatedArgs.input, "utf-8");

        // まずJSONとしてパースを試みる（audio query形式）
        try {
          const parsedData = JSON.parse(fileContent);

          // 配列の場合はmulti mode用のaudio queriesとして処理
          if (Array.isArray(parsedData)) {
            const audioQueries = parsedData.map((item) =>
              audioQueryDataSchema.parse(item),
            );

            log.debug("Making multi synthesis API request", {
              baseUrl: validatedArgs.baseUrl,
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
            );

            // ZIP形式で受け取った音声データを保存
            const outputFile =
              validatedArgs.output || "output/multi_synthesis.zip";
            writeFileSync(outputFile, Buffer.from(zipData));

            const outputFormat = resolveOutputFormat(
              validatedArgs.type,
              validatedArgs.json,
            );

            if (outputFormat === "json") {
              outputJson({
                success: true,
                output: outputFile,
                speaker: speakerId,
                count: audioQueries.length,
                fileSize: zipData.byteLength,
                format: "zip",
              });
              return;
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

            return;
          }

          // オブジェクトの場合は単一のaudio queryとして処理
          audioQuery = audioQueryDataSchema.parse(parsedData);
        } catch {
          // JSONパースに失敗した場合、テキストファイルとして処理
          log.debug("Input file is not JSON, treating as text file", {
            inputFile: validatedArgs.input,
          });

          const lines = fileContent
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line.length > 0);

          // 複数行の場合は multi_synthesis を使用
          if (lines.length > 1) {
            display.info(
              t("commands.synthesis.loadingMultiText", {
                count: String(lines.length),
              }),
            );

            const audioQueries: AudioQuery[] = [];

            // 各行に対して audio_query を生成
            for (const line of lines) {
              log.debug("Making audio query API request for line", {
                baseUrl: validatedArgs.baseUrl,
                speaker: speakerId,
                text: line,
              });

              const audioQueryRes = await client.POST("/audio_query", {
                params: { query: { speaker: speakerId, text: line } },
              });
              const audioQuery = validateResponse(
                audioQueryRes,
                "Audio query failed: empty response",
                { speakerId, text: line },
              );
              audioQueries.push(audioQuery);
            }

            log.debug("Making multi synthesis API request", {
              baseUrl: validatedArgs.baseUrl,
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
            );

            // ZIP形式で受け取った音声データを保存
            const outputFile =
              validatedArgs.output || "output/multi_synthesis.zip";
            writeFileSync(outputFile, Buffer.from(zipData));

            const outputFormat = resolveOutputFormat(
              validatedArgs.type,
              validatedArgs.json,
            );

            if (outputFormat === "json") {
              outputJson({
                success: true,
                output: outputFile,
                speaker: speakerId,
                count: audioQueries.length,
                fileSize: zipData.byteLength,
                format: "zip",
              });
              return;
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

            return;
          }

          // 1行の場合は通常のテキストとして処理
          if (lines.length === 1) {
            const text = lines[0] ?? "";
            log.debug("Making audio query API request", {
              baseUrl: validatedArgs.baseUrl,
              speaker: speakerId,
              text,
            });

            const audioQueryRes = await client.POST("/audio_query", {
              params: { query: { speaker: speakerId, text } },
            });
            audioQuery = validateResponse(
              audioQueryRes,
              "Audio query failed: empty response",
              { speakerId, text },
            );
          } else {
            throw new VoicevoxError(
              "Input file is empty",
              ErrorType.VALIDATION,
              undefined,
              { inputFile: validatedArgs.input },
            );
          }
        }
      } else {
        // テキストから音声クエリを生成
        const text = validatedArgs.text ?? "";
        log.debug("Making audio query API request", {
          baseUrl: validatedArgs.baseUrl,
          speaker: speakerId,
          text,
        });

        const audioQueryRes = await client.POST("/audio_query", {
          params: { query: { speaker: speakerId, text } },
        });
        audioQuery = validateResponse(
          audioQueryRes,
          "Audio query failed: empty response",
          { speakerId, text },
        );
      }

      // 2. 音声合成を実行 (POST /synthesis?speaker) with audioQuery body
      const synthesisRes = await client.POST("/synthesis", {
        params: { query: { speaker: speakerId } },
        body: audioQuery,
        parseAs: "arrayBuffer",
      });
      const synthesisData = validateResponse(
        synthesisRes,
        "Synthesis failed: empty response",
        { speakerId, text: validatedArgs.text },
      );

      // 出力ファイル名を決定
      const outputFile = validatedArgs.output || "output/synthesis.wav";

      // 音声データをファイルに保存
      writeFileSync(outputFile, Buffer.from(synthesisData));

      // 出力形式を決定（--type が優先、次に --json）
      const outputFormat = resolveOutputFormat(
        validatedArgs.type,
        validatedArgs.json,
      );

      // JSON形式で出力する場合
      if (outputFormat === "json") {
        const result = {
          success: true,
          output: outputFile,
          speaker: speakerId,
          text: validatedArgs.text,
          input: validatedArgs.input,
          audioQuery: audioQuery,
          fileSize: synthesisData.byteLength,
          play: validatedArgs.play || false,
        };
        outputJson(result);
        return;
      }

      display.info(
        t("commands.synthesis.synthesisComplete", { output: outputFile }),
      );

      // 再生オプションが指定されている場合
      if (validatedArgs.play) {
        display.info(t("commands.synthesis.playingAudio"));
        await playAudio(outputFile);
      }

      log.debug("Synthesis command completed successfully", {
        outputFile,
        played: validatedArgs.play || false,
      });
    } catch (error) {
      handleError(error, "synthesis", {
        speaker: args.speaker,
        text: args.text,
        input: args.input,
        output: args.output,
        baseUrl: args.baseUrl,
      });
    }
  },
});
