import { t } from "@/i18n/index.js";
import { display } from "@/logger.js";

export const synthesisMessages = {
  showLoadingInput: (input: string) =>
    display.info(t("commands.synthesis.loadingInput", { input })),

  showLoadingMultiInput: (input: string) =>
    display.info(t("commands.synthesis.loadingMultiInput", { input })),

  showLoadingMultiText: (count: number) =>
    display.info(
      t("commands.synthesis.loadingMultiText", { count: String(count) }),
    ),

  showSpeaker: (speaker: string | number) =>
    display.info(t("commands.synthesis.speakerId", { speaker })),

  showOutput: (output: string) =>
    display.info(t("commands.synthesis.output", { output })),

  showPlayFlag: (play: boolean) =>
    display.info(t("commands.synthesis.play", { play: String(play) })),

  showSynthesisComplete: (output: string) =>
    display.info(t("commands.synthesis.synthesisComplete", { output })),

  showMultiSynthesisComplete: (count: number) =>
    display.info(
      t("commands.synthesis.multiSynthesisComplete", { count: String(count) }),
    ),

  showPlaying: () => display.info(t("commands.synthesis.playingAudio")),
};
