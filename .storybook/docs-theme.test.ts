import { describe, expect, it, vi } from "vite-plus/test";

import { docsTheme, toHex } from "./docs-theme";

const TOKENS = {
  background: "#101828",
  border: "#202838",
  card: "#303848",
  foreground: "#f0f4f8",
  input: "#505868",
  muted: "#404858",
  "muted-foreground": "#a0a8b8",
  primary: "#8070f0",
} as const;

const themed = (): HTMLElement => {
  const element = document.createElement("div");

  Object.entries(TOKENS).map(([name, value]) => element.style.setProperty(`--${name}`, value));

  return document.body.appendChild(element);
};

describe("toHex", () => {
  it("converts an rgb color", () => {
    expect(toHex("rgb(255, 0, 128)")).toBe("#ff0080");
  });

  it("converts an oklch color, which Storybook's theme cannot parse", () => {
    expect(toHex("oklch(1 0 0)")).toBe("#ffffff");
  });

  it("keeps the color as is without a 2D context", () => {
    const getContext = vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);

    expect(toHex("oklch(1 0 0)")).toBe("oklch(1 0 0)");

    getContext.mockRestore();
  });
});

describe("docsTheme", () => {
  it("maps the contract tokens onto Storybook's theme", () => {
    const theme = docsTheme(themed(), "dark");

    expect(theme).toMatchObject({
      appBg: TOKENS.background,
      appBorderColor: TOKENS.border,
      appPreviewBg: TOKENS.card,
      base: "dark",
      booleanBg: TOKENS.muted,
      booleanSelectedBg: TOKENS.card,
      buttonBg: TOKENS.card,
      buttonBorder: TOKENS.input,
      colorSecondary: TOKENS.primary,
      inputBorder: TOKENS.input,
      textColor: TOKENS.foreground,
      textMutedColor: TOKENS["muted-foreground"],
    });
  });

  it("starts from the base theme of the mode", () => {
    expect(docsTheme(themed(), "light").base).toBe("light");
  });
});
