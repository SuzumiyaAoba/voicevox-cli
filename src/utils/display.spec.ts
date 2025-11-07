/**
 * 表示ユーティリティのテスト
 */

import { describe, expect, it } from "vitest";
import {
  centerText,
  createProgressBar,
  createSeparator,
  createTable,
  getDisplayWidth,
  padToWidth,
} from "./display.js";

describe("getDisplayWidth", () => {
  it("ASCIIキャラクターを1文字として計算する", () => {
    expect(getDisplayWidth("hello")).toBe(5);
    expect(getDisplayWidth("abc123")).toBe(6);
    expect(getDisplayWidth("A")).toBe(1);
  });

  it("ひらがなを2文字として計算する", () => {
    expect(getDisplayWidth("あ")).toBe(2);
    expect(getDisplayWidth("こんにちは")).toBe(10);
  });

  it("カタカナを2文字として計算する", () => {
    expect(getDisplayWidth("ア")).toBe(2);
    expect(getDisplayWidth("カタカナ")).toBe(8);
  });

  it("漢字を2文字として計算する", () => {
    expect(getDisplayWidth("漢")).toBe(2);
    expect(getDisplayWidth("日本語")).toBe(6);
  });

  it("全角記号を2文字として計算する", () => {
    expect(getDisplayWidth("、")).toBe(2);
    expect(getDisplayWidth("。")).toBe(2);
    expect(getDisplayWidth("「」")).toBe(4);
  });

  it("混在した文字列を正しく計算する", () => {
    expect(getDisplayWidth("Hello世界")).toBe(9); // "Hello"=5 + "世界"=4
    expect(getDisplayWidth("Test123テスト")).toBe(13); // "Test123"=7 + "テスト"=6
  });

  it("空の文字列に対して0を返す", () => {
    expect(getDisplayWidth("")).toBe(0);
  });

  it("スペースを正しく計算する", () => {
    expect(getDisplayWidth(" ")).toBe(1);
    expect(getDisplayWidth("   ")).toBe(3);
    expect(getDisplayWidth("　")).toBe(2); // 全角スペース
  });
});

describe("padToWidth", () => {
  it("ASCII文字列を指定幅にパディングする", () => {
    expect(padToWidth("hello", 10)).toBe("hello     ");
    expect(padToWidth("test", 8)).toBe("test    ");
  });

  it("日本語文字列を正しくパディングする", () => {
    expect(padToWidth("こんにちは", 12)).toBe("こんにちは  "); // 10+2=12
    expect(padToWidth("日本", 6)).toBe("日本  "); // 4+2=6
  });

  it("混在した文字列を正しくパディングする", () => {
    expect(padToWidth("Hello世界", 11)).toBe("Hello世界  "); // 9+2=11
  });

  it("幅が文字列より短い場合、パディングしない", () => {
    expect(padToWidth("hello", 3)).toBe("hello");
    expect(padToWidth("こんにちは", 5)).toBe("こんにちは");
  });

  it("幅が文字列と同じ場合、パディングしない", () => {
    expect(padToWidth("hello", 5)).toBe("hello");
    expect(padToWidth("あい", 4)).toBe("あい");
  });

  it("空の文字列を正しくパディングする", () => {
    expect(padToWidth("", 5)).toBe("     ");
  });
});

describe("createTable", () => {
  it("シンプルなテーブルを作成する", () => {
    const headers = ["Name", "Age"];
    const rows = [
      ["Alice", "30"],
      ["Bob", "25"],
    ];
    const columnWidths = [10, 5];

    const result = createTable(headers, rows, columnWidths);

    expect(result).toContain("Name");
    expect(result).toContain("Age");
    expect(result).toContain("Alice");
    expect(result).toContain("Bob");
    expect(result).toContain("=");
  });

  it("日本語を含むテーブルを作成する", () => {
    const headers = ["名前", "年齢"];
    const rows = [
      ["太郎", "30"],
      ["花子", "25"],
    ];
    const columnWidths = [10, 5];

    const result = createTable(headers, rows, columnWidths);

    expect(result).toContain("名前");
    expect(result).toContain("年齢");
    expect(result).toContain("太郎");
    expect(result).toContain("花子");
  });

  it("空の行配列でヘッダーのみのテーブルを作成する", () => {
    const headers = ["Name", "Age"];
    const rows: string[][] = [];
    const columnWidths = [10, 5];

    const result = createTable(headers, rows, columnWidths);

    expect(result).toContain("Name");
    expect(result).toContain("Age");
    expect(result).toContain("=");
  });

  it("複数行のテーブルを正しく整形する", () => {
    const headers = ["Col1", "Col2", "Col3"];
    const rows = [
      ["A", "B", "C"],
      ["D", "E", "F"],
      ["G", "H", "I"],
    ];
    const columnWidths = [6, 6, 6];

    const result = createTable(headers, rows, columnWidths);
    const lines = result.split("\n");

    // ヘッダー行 + 区切り線 + データ行3 + 最後の空行
    expect(lines.length).toBeGreaterThanOrEqual(5);
  });
});

describe("createSeparator", () => {
  it("指定幅の区切り線を作成する（デフォルト文字）", () => {
    expect(createSeparator(5)).toBe("=====");
    expect(createSeparator(10)).toBe("==========");
  });

  it("カスタム文字で区切り線を作成する", () => {
    expect(createSeparator(5, "-")).toBe("-----");
    expect(createSeparator(3, "*")).toBe("***");
  });

  it("幅0で空の文字列を返す", () => {
    expect(createSeparator(0)).toBe("");
  });

  it("大きな幅でも正しく動作する", () => {
    const result = createSeparator(100, "#");
    expect(result).toBe("#".repeat(100));
    expect(result.length).toBe(100);
  });
});

describe("centerText", () => {
  it("ASCII文字列を中央揃えする", () => {
    expect(centerText("test", 10)).toBe("   test   ");
    expect(centerText("hi", 6)).toBe("  hi  ");
  });

  it("日本語文字列を中央揃えする", () => {
    expect(centerText("あい", 8)).toBe("  あい  "); // 4文字幅+左右2スペース
  });

  it("奇数パディングで左を優先する", () => {
    const result = centerText("a", 6); // 5のパディング、左3、右2
    expect(result).toBe("  a   ");
  });

  it("カスタムパディング文字を使用する", () => {
    expect(centerText("test", 10, "-")).toBe("---test---");
  });

  it("メッセージが幅と同じ場合、パディングしない", () => {
    expect(centerText("hello", 5)).toBe("hello");
  });

  it("メッセージが幅より大きい場合、そのまま返す", () => {
    expect(centerText("hello world", 5)).toBe("hello world");
  });

  it("空のメッセージを正しく処理する", () => {
    expect(centerText("", 6)).toBe("      ");
  });

  it("日本語と英語の混在文字列を中央揃えする", () => {
    const result = centerText("Hello世界", 15); // 9文字幅 + 左3 + 右3 = 15
    expect(getDisplayWidth(result)).toBe(15);
    expect(result).toContain("Hello世界");
  });
});

describe("createProgressBar", () => {
  it("50%の進捗バーを作成する", () => {
    const result = createProgressBar(50, 100, 10);
    expect(result).toContain("50.0%");
    expect(result).toContain("█");
    expect(result).toContain("░");
  });

  it("0%の進捗バーを作成する", () => {
    const result = createProgressBar(0, 100, 10);
    expect(result).toContain("0.0%");
    expect(result).toMatch(/^░+\s+0\.0%$/);
  });

  it("100%の進捗バーを作成する", () => {
    const result = createProgressBar(100, 100, 10);
    expect(result).toContain("100.0%");
    expect(result).toMatch(/^█+\s+100\.0%$/);
  });

  it("カスタム文字で進捗バーを作成する", () => {
    const result = createProgressBar(50, 100, 10, "#", "-");
    expect(result).toContain("50.0%");
    expect(result).toContain("#");
    expect(result).toContain("-");
  });

  it("デフォルト幅で進捗バーを作成する", () => {
    const result = createProgressBar(50, 100);
    expect(result).toContain("50.0%");
    // デフォルト幅は30
    const barPart = result.split(" ")[0];
    expect(barPart?.length).toBe(30);
  });

  it("100%を超える値を100%として扱う", () => {
    const result = createProgressBar(150, 100, 10);
    expect(result).toContain("100.0%");
  });

  it("負の値を0%として扱う", () => {
    const result = createProgressBar(-10, 100, 10);
    expect(result).toContain("0.0%");
  });

  it("小数の進捗を正しく表示する", () => {
    const result = createProgressBar(33, 100, 10);
    expect(result).toContain("33.0%");
  });

  it("異なる合計値で正しく計算する", () => {
    const result = createProgressBar(25, 50, 10);
    expect(result).toContain("50.0%");
  });
});
