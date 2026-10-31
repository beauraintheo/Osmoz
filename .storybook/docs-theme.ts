import { themes } from "storybook/theming";
import type { ThemeVars } from "storybook/theming";

import type { useThemeStore } from "./use-theme-store";

type Mode = ReturnType<typeof useThemeStore.getState>["resolved"];

export const toHex = (color: string): string => {
  const canvas = document.createElement("canvas");
  const drawing = canvas.getContext("2d", { willReadFrequently: true });

  if (drawing === null) {
    return color;
  }

  drawing.fillStyle = color;
  drawing.fillRect(0, 0, 1, 1);

  const channels = Array.from(drawing.getImageData(0, 0, 1, 1).data.slice(0, 3), (channel) =>
    channel.toString(16).padStart(2, "0"),
  );

  return `#${channels.join("")}`;
};

export const docsTheme = (element: HTMLElement, mode: Mode): ThemeVars => {
  const styles = getComputedStyle(element);
  const token = (name: string): string => toHex(styles.getPropertyValue(`--${name}`).trim());

  return {
    ...themes[mode],
    appBg: token("background"),
    appBorderColor: token("border"),
    appContentBg: token("background"),
    appPreviewBg: token("card"),
    barBg: token("card"),
    barSelectedColor: token("primary"),
    barTextColor: token("muted-foreground"),
    booleanBg: token("muted"),
    booleanSelectedBg: token("card"),
    buttonBg: token("card"),
    buttonBorder: token("input"),
    colorSecondary: token("primary"),
    inputBg: token("card"),
    inputBorder: token("input"),
    inputTextColor: token("foreground"),
    textColor: token("foreground"),
    textInverseColor: token("background"),
    textMutedColor: token("muted-foreground"),
  };
};
