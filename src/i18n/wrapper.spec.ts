/**
 * i18nラッパーのテスト
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { t, tPlural, getCurrentLocale, changeLocale, hasTranslation } from "./wrapper.js";
import i18next from "./config.js";

// モックの設定
vi.mock("./config.js", () => ({
  default: {
    t: vi.fn(),
    language: "en",
    changeLanguage: vi.fn(),
    exists: vi.fn(),
  },
}));

describe("t", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("基本的な翻訳キーで翻訳を取得する", () => {
    const mockTranslation = "Test Translation";
    (i18next.t as any).mockReturnValue(mockTranslation);

    const result = t("commands.synthesis.name");

    expect(i18next.t).toHaveBeenCalledWith("commands.synthesis.name", undefined);
    expect(result).toBe(mockTranslation);
  });

  it("パラメータ付きで翻訳を取得する", () => {
    const mockTranslation = "Synthesizing: Hello";
    const params = { text: "Hello" };
    (i18next.t as any).mockReturnValue(mockTranslation);

    const result = t("commands.synthesis.synthesizing", params);

    expect(i18next.t).toHaveBeenCalledWith("commands.synthesis.synthesizing", params);
    expect(result).toBe(mockTranslation);
  });

  it("複数のパラメータで翻訳を取得する", () => {
    const mockTranslation = "Speaker 1: Hello World";
    const params = { speaker: "1", text: "Hello World" };
    (i18next.t as any).mockReturnValue(mockTranslation);

    const result = t("commands.synthesis.name" as any, params);

    expect(i18next.t).toHaveBeenCalledWith("commands.synthesis.name", params);
    expect(result).toBe(mockTranslation);
  });

  it("パラメータなしで翻訳を取得する", () => {
    const mockTranslation = "Simple Translation";
    (i18next.t as any).mockReturnValue(mockTranslation);

    const result = t("commands.synthesis.name" as any);

    expect(i18next.t).toHaveBeenCalledWith("commands.synthesis.name", undefined);
    expect(result).toBe(mockTranslation);
  });
});

describe("tPlural", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("複数形の翻訳を取得する", () => {
    const mockTranslation = "5 speakers found";
    const params = { count: 5 };
    (i18next.t as any).mockReturnValue(mockTranslation);

    const result = tPlural("commands.synthesis.name" as any, 5, params);

    expect(i18next.t).toHaveBeenCalledWith("commands.synthesis.name", {
      count: 5,
      category: "A",
    });
    expect(result).toBe(mockTranslation);
  });

  it("パラメータなしで複数形の翻訳を取得する", () => {
    const mockTranslation = "1 speaker found";
    (i18next.t as any).mockReturnValue(mockTranslation);

    const result = tPlural("commands.synthesis.name" as any, 1);

    expect(i18next.t).toHaveBeenCalledWith("commands.synthesis.name", {
      count: 1,
    });
    expect(result).toBe(mockTranslation);
  });

  it("複数のパラメータで複数形の翻訳を取得する", () => {
    const mockTranslation = "Found 3 speakers in category A";
    const params = { category: "A" };
    (i18next.t as any).mockReturnValue(mockTranslation);

    const result = tPlural("commands.synthesis.name" as any, 3, params);

    expect(i18next.t).toHaveBeenCalledWith("commands.synthesis.name", {
      count: 3,
      ...params,
    });
    expect(result).toBe(mockTranslation);
  });
});

describe("getCurrentLocale", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("現在のロケールを取得する", () => {
    (i18next.language as any) = "ja";

    const result = getCurrentLocale();

    expect(result).toBe("ja");
  });

  it("異なるロケールで現在のロケールを取得する", () => {
    (i18next.language as any) = "en";

    const result = getCurrentLocale();

    expect(result).toBe("en");
  });
});

describe("changeLocale", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("ロケールを変更する", () => {
    changeLocale("ja");

    expect(i18next.changeLanguage).toHaveBeenCalledWith("ja");
  });

  it("異なるロケールに変更する", () => {
    changeLocale("en");

    expect(i18next.changeLanguage).toHaveBeenCalledWith("en");
  });

  it("フランス語ロケールに変更する", () => {
    changeLocale("fr");

    expect(i18next.changeLanguage).toHaveBeenCalledWith("fr");
  });
});

describe("hasTranslation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("翻訳が存在する場合にtrueを返す", () => {
    (i18next.exists as any).mockReturnValue(true);

    const result = hasTranslation("commands.synthesis.name");

    expect(i18next.exists).toHaveBeenCalledWith("commands.synthesis.name");
    expect(result).toBe(true);
  });

  it("翻訳が存在しない場合にfalseを返す", () => {
    (i18next.exists as any).mockReturnValue(false);

    const result = hasTranslation("commands.synthesis.name" as any);

    expect(i18next.exists).toHaveBeenCalledWith("commands.synthesis.name");
    expect(result).toBe(false);
  });

  it("異なるキーで翻訳の存在を確認する", () => {
    (i18next.exists as any).mockReturnValue(true);

    const result = hasTranslation("commands.synthesis.name" as any);

    expect(i18next.exists).toHaveBeenCalledWith("commands.synthesis.name");
    expect(result).toBe(true);
  });
});

describe("i18next export", () => {
  it("i18nextインスタンスが正しくエクスポートされる", () => {
    expect(i18next).toBeDefined();
    expect(typeof i18next.t).toBe("function");
    expect(typeof i18next.changeLanguage).toBe("function");
    expect(typeof i18next.exists).toBe("function");
  });
});
