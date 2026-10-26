import { describe, expect, it } from "vite-plus/test";

import { THEME_OPTIONS } from "./theme-options";

describe("THEME_OPTIONS", () => {
  it("declares the light and dark themes, matched to the system schemes", () => {
    expect(THEME_OPTIONS).toEqual({
      app: "flux",
      system: { dark: "dark", light: "light" },
      themes: ["light", "dark"],
    });
  });
});
