import { describe, expect, it } from "vite-plus/test";

import { docsTheme } from "./docs-theme";
import type { ThemeTokens } from "./theme-tokens";

const TOKENS: ThemeTokens = {
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

describe("docsTheme", () => {
  it("maps the contract tokens onto Storybook's theme", () => {
    expect(docsTheme(TOKENS)).toMatchObject({
      appBg: TOKENS.background,
      appBorderColor: TOKENS.border,
      appPreviewBg: TOKENS.card,
      barBg: TOKENS.card,
      barSelectedColor: TOKENS.primary,
      barTextColor: TOKENS.mutedForeground,
      base: "dark",
      booleanBg: TOKENS.muted,
      booleanSelectedBg: TOKENS.card,
      buttonBg: TOKENS.card,
      buttonBorder: TOKENS.input,
      colorSecondary: TOKENS.primary,
      fontBase: TOKENS.fontText,
      fontCode: TOKENS.fontCode,
      inputBorder: TOKENS.input,
      textColor: TOKENS.foreground,
      textMutedColor: TOKENS.mutedForeground,
    });
  });

  it("starts from the base theme of the color scheme", () => {
    expect(docsTheme({ ...TOKENS, colorScheme: "light" }).base).toBe("light");
  });
});
