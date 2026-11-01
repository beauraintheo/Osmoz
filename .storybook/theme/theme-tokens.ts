import { themes } from "storybook/theming";
import type { ThemeVars } from "storybook/theming";
import { z } from "zod/mini";

export const themeTokensSchema = z.object({
  accent: z.string(),
  accentForeground: z.string(),
  background: z.string(),
  border: z.string(),
  card: z.string(),
  colorScheme: z.enum(["light", "dark"]),
  fontCode: z.string(),
  fontText: z.string(),
  foreground: z.string(),
  input: z.string(),
  muted: z.string(),
  mutedForeground: z.string(),
  osmozCloud: z.string(),
  osmozO: z.string(),
  primary: z.string(),
});

export type ThemeTokens = z.infer<typeof themeTokensSchema>;

export interface FontTokens {
  code: string;
  text: string;
}

const toHex = (color: string): string => {
  const canvas = document.createElement("canvas");
  const drawing = canvas.getContext("2d", { willReadFrequently: true });

  if (drawing === null) {
    return color;
  }

  drawing.fillStyle = color;
  drawing.fillRect(0, 0, 1, 1);

  const pixel = drawing.getImageData(0, 0, 1, 1).data;
  const channels = Array.from(pixel.slice(0, pixel[3] === 255 ? 3 : 4), (channel) =>
    channel.toString(16).padStart(2, "0"),
  );

  return `#${channels.join("")}`;
};

export const readThemeTokens = (element: HTMLElement, fonts: FontTokens): ThemeTokens => {
  const styles = getComputedStyle(element);
  const value = (name: string): string => styles.getPropertyValue(`--${name}`).trim();
  const color = (name: string): string => toHex(value(name));

  return {
    accent: color("accent"),
    accentForeground: color("accent-foreground"),
    background: color("background"),
    border: color("border"),
    card: color("card"),
    colorScheme: styles.colorScheme === "dark" ? "dark" : "light",
    fontCode: value(fonts.code),
    fontText: value(fonts.text),
    foreground: color("foreground"),
    input: color("input"),
    muted: color("muted"),
    mutedForeground: color("muted-foreground"),
    osmozCloud: color("osmoz-cloud"),
    osmozO: color("osmoz-o"),
    primary: color("primary"),
  };
};

export const docsTheme = (tokens: ThemeTokens): ThemeVars => ({
  ...themes[tokens.colorScheme],
  appBg: tokens.background,
  appBorderColor: tokens.border,
  appContentBg: tokens.background,
  appPreviewBg: tokens.card,
  barBg: tokens.card,
  barSelectedColor: tokens.primary,
  barTextColor: tokens.mutedForeground,
  booleanBg: tokens.muted,
  booleanSelectedBg: tokens.card,
  buttonBg: tokens.card,
  buttonBorder: tokens.input,
  colorSecondary: tokens.primary,
  fontBase: tokens.fontText,
  fontCode: tokens.fontCode,
  inputBg: tokens.card,
  inputBorder: tokens.input,
  inputTextColor: tokens.foreground,
  textColor: tokens.foreground,
  textInverseColor: tokens.background,
  textMutedColor: tokens.mutedForeground,
});
