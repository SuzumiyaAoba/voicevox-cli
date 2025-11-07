/**
 * 表示を整えるためのユーティリティ関数
 * UNIX哲学に従い、プレーンテキストでの出力を重視
 */

/**
 * 文字列の実際の表示幅を計算する関数（日本語は2文字分）
 * @param str 計算対象の文字列
 * @returns 表示幅（文字数）
 */
export const getDisplayWidth = (str: string): number => {
  let width = 0;
  for (const char of str) {
    const code = char.codePointAt(0);
    if (!code) continue;

    // 日本語文字（ひらがな、カタカナ、漢字、全角記号）は2文字分
    if (
      (code >= 0x3040 && code <= 0x309f) || // ひらがな
      (code >= 0x30a0 && code <= 0x30ff) || // カタカナ
      (code >= 0x4e00 && code <= 0x9faf) || // 漢字
      (code >= 0xff00 && code <= 0xffef) || // 全角記号
      (code >= 0x3000 && code <= 0x303f) // 全角記号・句読点
    ) {
      width += 2;
    } else {
      width += 1;
    }
  }
  return width;
};

/**
 * パディング関数（表示幅を考慮、スペースで埋める）
 * @param str 対象文字列
 * @param targetWidth 目標表示幅
 * @returns パディングされた文字列
 */
export const padToWidth = (str: string, targetWidth: number): string => {
  const currentWidth = getDisplayWidth(str);
  const paddingNeeded = targetWidth - currentWidth;
  return str + " ".repeat(Math.max(0, paddingNeeded));
};

/**
 * テーブル形式の出力を生成する
 * @param headers ヘッダー配列
 * @param rows データ行の配列
 * @param columnWidths 各列の幅
 * @returns テーブル形式の文字列
 */
export const createTable = (
  headers: string[],
  rows: string[][],
  columnWidths: number[],
): string => {
  let output = "";

  // ヘッダー行を生成
  const headerLine = headers
    .map((header, index) => padToWidth(header, columnWidths[index] || 10))
    .join("");
  output += `${headerLine}\n`;

  // 区切り線を生成
  const headerWidth = getDisplayWidth(headerLine);
  output += `${"=".repeat(headerWidth)}\n`;

  // データ行を生成
  for (const row of rows) {
    const rowLine = row
      .map((cell, index) => padToWidth(cell, columnWidths[index] || 10))
      .join("");
    output += `${rowLine}\n`;
  }

  return output;
};

/**
 * 区切り線を生成する
 * @param width 区切り線の幅
 * @param char 使用する文字（デフォルト: "="）
 * @returns 区切り線文字列
 */
export const createSeparator = (width: number, char: string = "="): string => {
  return char.repeat(width);
};

/**
 * メッセージを中央揃えで表示する
 * @param message メッセージ
 * @param width 表示幅
 * @param paddingChar パディング文字（デフォルト: " "）
 * @returns 中央揃えされた文字列
 */
export const centerText = (
  message: string,
  width: number,
  paddingChar: string = " ",
): string => {
  const messageWidth = getDisplayWidth(message);
  const totalPadding = Math.max(0, width - messageWidth);
  const leftPadding = Math.floor(totalPadding / 2);
  const rightPadding = totalPadding - leftPadding;

  return (
    paddingChar.repeat(leftPadding) + message + paddingChar.repeat(rightPadding)
  );
};

/**
 * プログレスバーを生成する
 * @param current 現在の値
 * @param total 合計値
 * @param width プログレスバーの幅（デフォルト: 30）
 * @param filledChar 埋められた部分の文字（デフォルト: "█"）
 * @param emptyChar 空の部分の文字（デフォルト: "░"）
 * @returns プログレスバー文字列
 */
export const createProgressBar = (
  current: number,
  total: number,
  width: number = 30,
  filledChar: string = "█",
  emptyChar: string = "░",
): string => {
  const percentage = Math.min(100, Math.max(0, (current / total) * 100));
  const filledWidth = Math.floor((percentage / 100) * width);
  const emptyWidth = width - filledWidth;

  return `${filledChar.repeat(filledWidth)}${emptyChar.repeat(emptyWidth)} ${percentage.toFixed(1)}%`;
};
