import { afterEach, describe, expect, it } from "vite-plus/test";

import type { ThemeEvent } from "./theme-event";
import { restoreThemeEvent, saveThemeEvent } from "./theme-event-cache";

const KEY = "osmoz-storybook:manager-theme";

const EVENT: ThemeEvent = {
  brandTitle: "<span>Osmoz</span>",
  brandUrl: "./?path=/docs/flux-introduction--docs",
  section: "flux",
  tokens: {
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
  },
};

describe("theme event cache", () => {
  afterEach(() => {
    localStorage.removeItem(KEY);
  });

  it("gives back the last theme the preview sent", () => {
    saveThemeEvent(EVENT);

    expect(restoreThemeEvent()).toEqual(EVENT);
  });

  it("gives nothing before the preview sent a theme", () => {
    expect(restoreThemeEvent()).toBeUndefined();
  });

  it("ignores a stored value that is not JSON", () => {
    localStorage.setItem(KEY, "{");

    expect(restoreThemeEvent()).toBeUndefined();
  });

  it("ignores a stored value that is not a theme", () => {
    localStorage.setItem(KEY, JSON.stringify({ section: "flux" }));

    expect(restoreThemeEvent()).toBeUndefined();
  });
});
