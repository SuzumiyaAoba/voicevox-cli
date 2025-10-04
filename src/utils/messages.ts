import i18next from "@/i18n/config.js";
import { display } from "@/logger.js";

export const synthesisMessages = {
  showLoadingInput: (input: string) =>
    display.info(i18next.t("commands.synthesis.loadingInput", { input })),

  showLoadingMultiInput: (input: string) =>
    display.info(i18next.t("commands.synthesis.loadingMultiInput", { input })),

  showLoadingMultiText: (count: number) =>
    display.info(
      i18next.t("commands.synthesis.loadingMultiText", { count: count }),
    ),

  showSpeaker: (speaker: string | number) =>
    display.info(i18next.t("commands.synthesis.speakerId", { speaker })),

  showOutput: (output: string) =>
    display.info(i18next.t("commands.synthesis.output", { output })),

  showPlayFlag: (play: boolean) =>
    display.info(i18next.t("commands.synthesis.play", { play: String(play) })),

  showSynthesisComplete: (output: string) =>
    display.info(i18next.t("commands.synthesis.synthesisComplete", { output })),

  showMultiSynthesisComplete: (count: number) =>
    display.info(
      i18next.t("commands.synthesis.multiSynthesisComplete", { count: count }),
    ),

  showPlaying: () => display.info(i18next.t("commands.synthesis.playingAudio")),
};
