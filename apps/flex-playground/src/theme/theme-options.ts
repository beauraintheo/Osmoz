import { defineThemeOptions } from "@osmoz/preferences/theme/theme-options";

export const THEME_OPTIONS = defineThemeOptions({
  app: "flux",
  system: { dark: "dark", light: "light" },
  themes: ["light", "dark"],
});
