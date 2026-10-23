import { defineThemeOptions } from "@osmoz/theme/theme-options";

export const THEME_OPTIONS = defineThemeOptions({
  app: "flux",
  themes: ["light", "dark"],
  system: { light: "light", dark: "dark" },
});
