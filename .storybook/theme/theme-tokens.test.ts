import { describe, expect, it, vi } from "vite-plus/test";

import { docsTheme, readThemeTokens } from "./theme-tokens";
import type { ThemeTokens } from "./theme-tokens";

const FONTS = { code: "app-font-mono", text: "app-font-sans" } as const;

const TOKENS = {
  accent: "#252b5e",
  "accent-foreground": "#ede8ff",
  "app-font-mono": "Code Font, monospace",
  "app-font-sans": "Text Font, sans-serif",
  background: "rgb(16, 24, 40)",
  border: "#202838",
  card: "#303848",
  foreground: "#f0f4f8",
  input: "#505868",
  muted: "#404858",
  "muted-foreground": "#a0a8b8",
  "osmoz-cloud": "#9c8cff",
  "osmoz-o": "#ff8fb8",
  primary: "oklch(1 0 0)",
} as const;

const THEME_TOKENS: ThemeTokens = {
  accent: "#252b5e",
  accentForeground: "#ede8ff",
  background: "#101828",
  border: "#202838",
  card: "#303848",
  colorScheme: "dark",
  fontCode: "Code Font, monospace",
  fontText: "Text Font, sans-serif",
  foreground: "#f0f4f8",
  input: "#505868",
  muted: "#404858",
  mutedForeground: "#a0a8b8",
  osmozCloud: "#9c8cff",
  osmozO: "#ff8fb8",
  primary: "#8070f0",
};

const themed = (colorScheme: string): HTMLElement => {
  const element = document.createElement("div");

  Object.entries(TOKENS).map(([name, value]) => element.style.setProperty(`--${name}`, value));
  element.style.colorScheme = colorScheme;

  return document.body.appendChild(element);
};

describe("readThemeTokens", () => {
  it("reads the contract tokens as hex colors and the fonts as they are", () => {
    expect(readThemeTokens(themed("dark"), FONTS)).toEqual({
      accent: "#252b5e",
      accentForeground: "#ede8ff",
      background: "#101828",
      border: "#202838",
      card: "#303848",
      colorScheme: "dark",
      fontCode: TOKENS["app-font-mono"],
      fontText: TOKENS["app-font-sans"],
      foreground: "#f0f4f8",
      input: "#505868",
      muted: "#404858",
      mutedForeground: "#a0a8b8",
      osmozCloud: "#9c8cff",
      osmozO: "#ff8fb8",
      primary: "#ffffff",
    });
  });

  it("keeps the transparency of a translucent token", () => {
    const element = themed("dark");

    element.style.setProperty("--border", "rgb(255 255 255 / 50%)");

    expect(readThemeTokens(element, FONTS).border).toBe("#ffffff80");
  });

  it("treats any other color scheme as light", () => {
    expect(readThemeTokens(themed("normal"), FONTS).colorScheme).toBe("light");
  });

  it("keeps the colors as they are without a 2D context", () => {
    const getContext = vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);

    expect(readThemeTokens(themed("light"), FONTS).primary).toBe(TOKENS.primary);

    getContext.mockRestore();
  });
});

describe("docsTheme", () => {
  it("maps the contract tokens onto Storybook's theme", () => {
    expect(docsTheme(THEME_TOKENS)).toMatchObject({
      appBg: THEME_TOKENS.background,
      appBorderColor: THEME_TOKENS.border,
      appPreviewBg: THEME_TOKENS.card,
      barBg: THEME_TOKENS.card,
      barSelectedColor: THEME_TOKENS.primary,
      barTextColor: THEME_TOKENS.mutedForeground,
      base: "dark",
      booleanBg: THEME_TOKENS.muted,
      booleanSelectedBg: THEME_TOKENS.card,
      buttonBg: THEME_TOKENS.card,
      buttonBorder: THEME_TOKENS.input,
      colorSecondary: THEME_TOKENS.primary,
      fontBase: THEME_TOKENS.fontText,
      fontCode: THEME_TOKENS.fontCode,
      inputBorder: THEME_TOKENS.input,
      textColor: THEME_TOKENS.foreground,
      textMutedColor: THEME_TOKENS.mutedForeground,
    });
  });

  it("starts from the base theme of the color scheme", () => {
    expect(docsTheme({ ...THEME_TOKENS, colorScheme: "light" }).base).toBe("light");
  });
});
