import { describe, expect, it, vi } from "vite-plus/test";

import { readThemeTokens } from "./theme-tokens";

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
