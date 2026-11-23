import { defineThemeOptions } from "@osmoz/preferences/theme/theme-options";

export const THEME_OPTIONS = defineThemeOptions({
  app: "osmoz-css",
  system: { dark: "dark", light: "light" },
  themes: ["light", "dark"],
});
