import { createThemeStore } from "@osmoz/preferences/theme/create-theme-store";
import { defineThemeOptions } from "@osmoz/preferences/theme/theme-options";

export const useThemeStore = createThemeStore(
  defineThemeOptions({
    app: "osmoz-storybook",
    system: { dark: "dark", light: "light" },
    themes: ["light", "dark"],
  }),
);
