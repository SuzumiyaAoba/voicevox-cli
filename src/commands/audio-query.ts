import { defineCommand } from "citty";
import { t } from "@/i18n/index.js";
import { display, log } from "@/logger.js";
import { baseUrlOption } from "@/options.js";
import { createVoicevoxClient } from "@/utils/client.js";

// 日本語文字の幅を計算する関数（日本語は2文字分、英数字は1文字分）
const getStringWidth = (str: string): number => {
  let width = 0;
  for (const char of str) {
    // 日本語文字（ひらがな、カタカナ、漢字）は2文字分
    if (/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(char)) {
      width += 2;
    } else {
      width += 1;
    }
  }
  return width;
};

// 指定した幅まで文字列をパディングする関数
const padToWidth = (str: string, targetWidth: number): string => {
  const currentWidth = getStringWidth(str);
  const padding = targetWidth - currentWidth;
  return str + ' '.repeat(Math.max(0, padding));
};

// 音声クエリを整形して表示する関数
const displayAudioQuery = (audioQuery: any) => {
  console.log("\n📊 音声クエリ情報");
  
  // 各項目名の幅を計算
  const labels = [
    '速度', 'ピッチ', 'イントネーション', '音量', 
    '前音素長', '後音素長', 'サンプリング', 'ステレオ', 'カナ'
  ];
  const maxWidth = Math.max(...labels.map(getStringWidth));
  
  console.log(`${padToWidth('速度', maxWidth)} : ${audioQuery.speedScale}`);
  console.log(`${padToWidth('ピッチ', maxWidth)} : ${audioQuery.pitchScale}`);
  console.log(`${padToWidth('イントネーション', maxWidth)} : ${audioQuery.intonationScale}`);
  console.log(`${padToWidth('音量', maxWidth)} : ${audioQuery.volumeScale}`);
  console.log(`${padToWidth('前音素長', maxWidth)} : ${audioQuery.prePhonemeLength}s`);
  console.log(`${padToWidth('後音素長', maxWidth)} : ${audioQuery.postPhonemeLength}s`);
  console.log(`${padToWidth('サンプリング', maxWidth)} : ${audioQuery.outputSamplingRate}Hz`);
  console.log(`${padToWidth('ステレオ', maxWidth)} : ${audioQuery.outputStereo ? 'ON' : 'OFF'}`);
  
  if (audioQuery.kana) {
    console.log(`${padToWidth('カナ', maxWidth)} : ${audioQuery.kana}`);
  }
  
  // アクセント句をコンパクトに表示
  console.log("\n🎵 アクセント句");
  audioQuery.accent_phrases.forEach((phrase: any, index: number) => {
    const moraTexts = phrase.moras.map((mora: any) => mora.text).join('');
    const accentMark = phrase.accent > 0 ? ` (アクセント: ${phrase.accent})` : '';
    const questionMark = phrase.is_interrogative ? '?' : '';
    console.log(`  ${index + 1}. ${moraTexts}${accentMark}${questionMark}`);
    
    // モーラの詳細を1行で表示
    const moraDetails = phrase.moras.map((mora: any, moraIndex: number) => {
      const consonant = mora.consonant || '';
      const vowel = mora.vowel;
      const length = (mora.consonant_length || 0) + mora.vowel_length;
      const pitch = mora.pitch.toFixed(1);
      return `${mora.text}(${consonant}${vowel}:${length.toFixed(2)}s:${pitch}Hz)`;
    }).join(' ');
    
    console.log(`     ${moraDetails}`);
  });
};

// 音声クエリコマンド
export const audioQueryCommand = defineCommand({
  meta: {
    name: t("commands.audioQuery.name"),
    description: t("commands.audioQuery.description"),
  },
  args: {
    text: {
      type: "positional",
      description: t("commands.audioQuery.args.text"),
      required: true,
    },
    speaker: {
      type: "string",
      description: t("commands.audioQuery.args.speaker"),
      alias: "s",
      default: "2",
    },
    "enable-katakana-english": {
      type: "boolean",
      description: t("commands.audioQuery.args.enableKatakanaEnglish"),
    },
    ...baseUrlOption,
  },
  async run({ args }) {
    log.debug("Starting audio-query command", {
      text: args.text,
      speaker: args.speaker,
      enableKatakanaEnglish: args["enable-katakana-english"],
      baseUrl: args.baseUrl,
    });

    display.info(t("commands.audioQuery.querying", { text: args.text }));
    display.info(t("commands.audioQuery.speakerId", { speaker: args.speaker }));

    try {
      log.debug("Making audio query API request", {
        baseUrl: args.baseUrl,
        speaker: args.speaker,
        text: args.text,
      });

      const speakerId = Number(args.speaker);
      const client = createVoicevoxClient({ baseUrl: args.baseUrl });

      // 音声クエリを生成
      const audioQueryRes = await client.POST("/audio_query", {
        params: {
          query: {
            speaker: speakerId,
            text: args.text,
            enable_kana_conversion: args["enable-katakana-english"] || false,
          },
        },
      });

      if (!audioQueryRes.data) {
        display.error(t("commands.audioQuery.queryError"));
        process.exit(1);
      }

      const audioQuery = audioQueryRes.data;

      display.info(t("commands.audioQuery.queryComplete"));

      // 整形して表示
      display.info(t("commands.audioQuery.queryResult"));
      displayAudioQuery(audioQuery);

      log.debug("Audio query command completed successfully", {
        queryKeys: Object.keys(audioQuery),
      });
    } catch (error) {
      log.error("Error in audio-query command", {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      display.error(t("commands.audioQuery.queryError"));
      if (error instanceof Error) {
        display.error(`  ${error.message}`);
        if (error.message.includes("fetch")) {
          display.error(t("commands.audioQuery.makeSureEngineRunning"));
        }
      } else {
        display.error(`  ${t("common.unknown")}`);
      }
      process.exit(1);
    }
  },
});
