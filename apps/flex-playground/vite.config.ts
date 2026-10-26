import { defineAppConfig } from "@osmoz/config/define-app-config";
import { firstPaintScript } from "@osmoz/preferences/theme/first-paint-script";
import { defineConfig } from "vite-plus";

import { THEME_OPTIONS } from "./src/theme/theme-options";

export default defineConfig(
  defineAppConfig({
    root: import.meta.dirname,
    headScripts: [firstPaintScript(THEME_OPTIONS)],
  }),
);
