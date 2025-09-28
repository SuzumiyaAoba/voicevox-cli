import { defineCommand } from "citty";
import { t } from "../i18n/index.js";
import { display, log } from "../logger.js";
import { baseUrlOption } from "../options.js";

// 音声合成コマンド
export const speakCommand = defineCommand({
  meta: {
    name: t("commands.speak.name"),
    description: t("commands.speak.description"),
  },
  args: {
    text: {
      type: "positional",
      description: t("commands.speak.args.text"),
      required: true,
    },
    speaker: {
      type: "string",
      description: t("commands.speak.args.speaker"),
      alias: "s",
      default: "0",
    },
    output: {
      type: "string",
      description: t("commands.speak.args.output"),
      alias: "o",
    },
    play: {
      type: "boolean",
      description: t("commands.speak.args.play"),
    },
    ...baseUrlOption,
  },
  run({ args }) {
    log.debug("Starting speak command", {
      text: args.text,
      speaker: args.speaker,
      output: args.output,
      play: args.play,
      baseUrl: args.baseUrl,
    });

    display.info(t("commands.speak.synthesizing", { text: args.text }));
    display.info(t("commands.speak.speakerId", { speaker: args.speaker }));
    display.info(
      t("commands.speak.output", { output: args.output || "default.wav" }),
    );
    display.info(
      t("commands.speak.play", { play: String(args.play || false) }),
    );

    log.debug("Speak command parameters processed", {
      speakerId: args.speaker,
      outputFile: args.output || "default.wav",
      shouldPlay: args.play || false,
    });

    // TODO: Voicevox API呼び出しの実装
  },
});
