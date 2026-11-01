import { themes } from "storybook/theming";
import type { ThemeVars } from "storybook/theming";

import type { ThemeTokens } from "./theme-tokens";

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
