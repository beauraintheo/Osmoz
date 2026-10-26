import { describe, expect, it } from "vite-plus/test";

import { defineThemeOptions, themeStorageKey } from "./theme-options.ts";

describe("defineThemeOptions", () => {
  it("returns the options unchanged", () => {
    const options = {
      app: "demo",
      system: { dark: "ink", light: "paper" },
      themes: ["paper", "ink"],
    } as const;

    expect(defineThemeOptions(options)).toBe(options);
  });
});

describe("themeStorageKey", () => {
  it("scopes the key to the app", () => {
    expect(themeStorageKey("flux")).toBe("flux:theme");
  });
});
