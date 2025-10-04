/**
 * 出力ユーティリティ
 *
 * データをJSON形式またはテキスト形式で出力するための関数を提供します。
 * コマンドラインオプション（--json, --type）に基づいた出力制御をサポートします。
 *
 * @module output
 */

import { display } from "@/logger.js";

/**
 * JSON形式でデータを出力する
 *
 * データをJSON.stringifyで整形（インデント2）して標準出力に表示します。
 *
 * @param data - 出力するデータ
 */
export const outputJson = (data: unknown): void => {
  const output = JSON.stringify(data, null, 2);
  display.info(output);
};

/**
 * 条件に応じてJSON形式またはカスタム形式で出力する
 * @param condition - JSON出力の条件（通常はargs.jsonやargs.typeの値）
 * @param data - 出力するデータ
 * @param textFormatter - テキスト形式で出力する関数（conditionがfalseの場合に呼ばれる）
 */
export const outputConditional = (
  condition: boolean,
  data: unknown,
  textFormatter: () => void,
): void => {
  if (condition) {
    outputJson(data);
  } else {
    textFormatter();
  }
};

/**
 * 出力形式を決定する（--type が優先、次に --json）
 * @param type - --type オプションの値
 * @param json - --json オプションの値
 * @returns 出力形式（"json" | "text"）
 */
export const resolveOutputFormat = (
  type?: "json" | "text",
  json?: boolean,
): "json" | "text" => {
  return type || (json ? "json" : "text");
};
