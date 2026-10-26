import { defineThemeOptions } from "@osmoz/preferences/theme/theme-options";

export const THEME_OPTIONS = defineThemeOptions({
  app: "flux",
  themes: ["light", "dark"],
  system: { light: "light", dark: "dark" },
});
