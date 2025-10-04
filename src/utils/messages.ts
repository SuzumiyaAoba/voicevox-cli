/**
 * ユーザー向けメッセージ表示ユーティリティ
 *
 * 各コマンドで使用するローカライズされたメッセージを表示する関数を提供します。
 *
 * @module messages
 */

import i18next from "@/i18n/config.js";
import { display } from "@/logger.js";

/**
 * 音声合成コマンド用のメッセージ表示オブジェクト
 *
 * 音声合成処理の各段階でユーザーに情報を伝えるための関数群。
 * すべてのメッセージは国際化（i18next）に対応しています。
 */
export const synthesisMessages = {
  /**
   * 入力ファイルの読み込み開始メッセージを表示
   * @param input - 入力ファイルのパス
   */
  showLoadingInput: (input: string) =>
    display.info(i18next.t("commands.synthesis.loadingInput", { input })),

  /**
   * マルチモード入力ファイルの読み込み開始メッセージを表示
   * @param input - 入力ファイルのパス
   */
  showLoadingMultiInput: (input: string) =>
    display.info(i18next.t("commands.synthesis.loadingMultiInput", { input })),

  /**
   * マルチモードテキスト処理数を表示
   * @param count - 処理するテキストの数
   */
  showLoadingMultiText: (count: number) =>
    display.info(
      i18next.t("commands.synthesis.loadingMultiText", { count: count }),
    ),

  /**
   * 使用する話者IDを表示
   * @param speaker - 話者ID
   */
  showSpeaker: (speaker: string | number) =>
    display.info(i18next.t("commands.synthesis.speakerId", { speaker })),

  /**
   * 出力先ファイルパスを表示
   * @param output - 出力ファイルのパス
   */
  showOutput: (output: string) =>
    display.info(i18next.t("commands.synthesis.output", { output })),

  /**
   * 音声再生フラグの状態を表示
   * @param play - 再生するかどうか
   */
  showPlayFlag: (play: boolean) =>
    display.info(i18next.t("commands.synthesis.play", { play: String(play) })),

  /**
   * 音声合成完了メッセージを表示
   * @param output - 出力ファイルのパス
   */
  showSynthesisComplete: (output: string) =>
    display.info(i18next.t("commands.synthesis.synthesisComplete", { output })),

  /**
   * マルチモード音声合成完了メッセージを表示
   * @param count - 合成した音声の数
   */
  showMultiSynthesisComplete: (count: number) =>
    display.info(
      i18next.t("commands.synthesis.multiSynthesisComplete", { count: count }),
    ),

  /**
   * 音声再生開始メッセージを表示
   */
  showPlaying: () => display.info(i18next.t("commands.synthesis.playingAudio")),
};
