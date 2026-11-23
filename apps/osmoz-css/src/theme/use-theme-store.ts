import { createThemeStore } from "@osmoz/preferences/theme/create-theme-store";

import { THEME_OPTIONS } from "./theme-options";

export const useThemeStore = createThemeStore(THEME_OPTIONS);
