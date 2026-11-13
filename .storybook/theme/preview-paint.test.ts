import { afterEach, describe, expect, it } from "vite-plus/test";

import {
  paintPreview,
  PREVIEW_BACKGROUND,
  PREVIEW_PAINT_STYLE,
  previewHead,
  previewPaintScript,
  THEME_EVENT_KEY,
} from "./preview-paint";

const root = document.documentElement;

const runScript = (): void => {
  const script = document.createElement("script");
  script.textContent = previewPaintScript();
  document.head.append(script);
  script.remove();
};

const clearPaint = (): void => {
  root.style.removeProperty(PREVIEW_BACKGROUND);
  root.style.removeProperty("color-scheme");
  localStorage.removeItem(THEME_EVENT_KEY);
};

describe("paintPreview", () => {
  afterEach(clearPaint);

  it("gives the page the theme's background and color scheme", () => {
    paintPreview(root, { background: "#101828", colorScheme: "dark" });

    expect(root.style.getPropertyValue(PREVIEW_BACKGROUND)).toBe("#101828");
    expect(getComputedStyle(root).colorScheme).toBe("dark");
  });
});

describe("previewPaintScript", () => {
  afterEach(clearPaint);

  it("paints the page from the last theme sent, before any render", () => {
    localStorage.setItem(
      THEME_EVENT_KEY,
      JSON.stringify({ tokens: { background: "#101828", colorScheme: "dark" } }),
    );

    runScript();

    expect(root.style.getPropertyValue(PREVIEW_BACKGROUND)).toBe("#101828");
    expect(root.style.getPropertyValue("color-scheme")).toBe("dark");
  });

  it("leaves the page alone before any theme was sent", () => {
    runScript();

    expect(root.style.getPropertyValue(PREVIEW_BACKGROUND)).toBe("");
    expect(root.style.getPropertyValue("color-scheme")).toBe("");
  });

  it("ignores a stored theme with unexpected values", () => {
    localStorage.setItem(
      THEME_EVENT_KEY,
      JSON.stringify({ tokens: { background: 3, colorScheme: "sepia" } }),
    );

    runScript();

    expect(root.style.getPropertyValue(PREVIEW_BACKGROUND)).toBe("");
    expect(root.style.getPropertyValue("color-scheme")).toBe("");
  });
});

describe("previewHead", () => {
  it("adds the paint style and script after Storybook's head", () => {
    expect(previewHead("<meta>")).toBe(
      `<meta><style>${PREVIEW_PAINT_STYLE}</style><script>${previewPaintScript()}</script>`,
    );
  });

  it("starts from an empty head when Storybook has none", () => {
    expect(previewHead()).toBe(
      `<style>${PREVIEW_PAINT_STYLE}</style><script>${previewPaintScript()}</script>`,
    );
  });

  it("paints the page and Storybook's loaders with the theme background", () => {
    expect(PREVIEW_PAINT_STYLE).toContain(".sb-preparing-story");
    expect(PREVIEW_PAINT_STYLE).toContain(".sb-preparing-docs");
    expect(PREVIEW_PAINT_STYLE).toContain(`var(${PREVIEW_BACKGROUND}, Canvas)`);
  });
});
