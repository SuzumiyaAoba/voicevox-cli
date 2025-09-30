import { defineCommand } from "citty";
import { t } from "@/i18n/index.js";
import { display, log } from "@/logger.js";
import { baseUrlOption } from "@/options.js";
import { createClient } from "@/utils/api-helpers.js";
import { playAudio } from "@/utils/audio-player.js";
import { handleError } from "@/utils/error-handler.js";
import { resolveOutputFormat } from "@/utils/output.js";
import { synthesisSchema, validateArgs } from "@/utils/validation.js";
import {
  createAudioQueriesFromLines,
  createAudioQueryFromText,
  executeMultiSynthesis,
  executeSingleSynthesis,
  processInputFile,
  processMultiModeInput,
} from "./handlers.js";

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

    // 初期情報の表示
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
      const speakerId = Number(validatedArgs.speaker);
      const outputFormat = resolveOutputFormat(
        validatedArgs.type,
        validatedArgs.json,
      );

      // マルチモード（--multi オプション）の処理
      if (validatedArgs.multi && validatedArgs.input) {
        display.info(
          t("commands.synthesis.loadingMultiInput", {
            input: validatedArgs.input,
          }),
        );

        const audioQueries = processMultiModeInput(validatedArgs.input);
        const outputFile = validatedArgs.output || "output/multi_synthesis.zip";

        await executeMultiSynthesis({
          client,
          audioQueries,
          speakerId,
          outputFile,
          outputFormat,
          baseUrl: validatedArgs.baseUrl,
        });

        return;
      }

      // 入力ファイルが指定されている場合
      if (validatedArgs.input) {
        const result = processInputFile(validatedArgs.input);

        switch (result.type) {
          case "multi": {
            // JSON配列からマルチ合成
            const outputFile =
              validatedArgs.output || "output/multi_synthesis.zip";
            await executeMultiSynthesis({
              client,
              audioQueries: result.audioQueries,
              speakerId,
              outputFile,
              outputFormat,
              baseUrl: validatedArgs.baseUrl,
            });
            return;
          }

          case "text-multi": {
            // 複数行テキストからマルチ合成
            display.info(
              t("commands.synthesis.loadingMultiText", {
                count: String(result.lines.length),
              }),
            );

            const audioQueries = await createAudioQueriesFromLines(
              client,
              result.lines,
              speakerId,
              validatedArgs.baseUrl,
            );

            const outputFile =
              validatedArgs.output || "output/multi_synthesis.zip";
            await executeMultiSynthesis({
              client,
              audioQueries,
              speakerId,
              outputFile,
              outputFormat,
              baseUrl: validatedArgs.baseUrl,
            });
            return;
          }

          case "single": {
            // JSONオブジェクトからシングル合成
            const outputFile = validatedArgs.output || "output/synthesis.wav";
            await executeSingleSynthesis({
              client,
              audioQuery: result.audioQuery,
              speakerId,
              outputFile,
              outputFormat,
              input: validatedArgs.input,
              shouldPlay: validatedArgs.play || false,
            });

            // 再生オプションが指定されている場合
            if (validatedArgs.play) {
              display.info(t("commands.synthesis.playingAudio"));
              await playAudio(outputFile);
            }
            return;
          }

          case "text-single": {
            // 1行テキストからシングル合成
            const audioQuery = await createAudioQueryFromText(
              client,
              result.text,
              speakerId,
              validatedArgs.baseUrl,
            );

            const outputFile = validatedArgs.output || "output/synthesis.wav";
            await executeSingleSynthesis({
              client,
              audioQuery,
              speakerId,
              outputFile,
              outputFormat,
              text: result.text,
              shouldPlay: validatedArgs.play || false,
            });

            // 再生オプションが指定されている場合
            if (validatedArgs.play) {
              display.info(t("commands.synthesis.playingAudio"));
              await playAudio(outputFile);
            }
            return;
          }
        }
      }

      // テキストから音声クエリを生成してシングル合成
      const text = validatedArgs.text ?? "";
      const audioQuery = await createAudioQueryFromText(
        client,
        text,
        speakerId,
        validatedArgs.baseUrl,
      );

      const outputFile = validatedArgs.output || "output/synthesis.wav";
      await executeSingleSynthesis({
        client,
        audioQuery,
        speakerId,
        outputFile,
        outputFormat,
        text,
        shouldPlay: validatedArgs.play || false,
      });

      // 再生オプションが指定されている場合
      if (validatedArgs.play) {
        display.info(t("commands.synthesis.playingAudio"));
        await playAudio(outputFile);
      }
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
