import { resolve } from "node:path";

import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import type { ViteUserConfig } from "vite-plus";

import { headScriptsPlugin } from "./head-scripts-plugin.ts";
import { testConfig } from "./test-config.ts";

export interface AppConfigOptions {
  headScripts?: readonly string[];
  root: string;
}

export const defineAppConfig = ({ headScripts = [], root }: AppConfigOptions): ViteUserConfig => ({
  plugins: [
    headScriptsPlugin(headScripts),
    tanstackRouter({
      autoCodeSplitting: true,
      generatedRouteTree: resolve(root, "src/route-tree.gen.ts"),
      indexToken: "home",
      routesDirectory: resolve(root, "src/routes"),
      target: "react",
    }),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": resolve(root, "src"),
    },
  },
  test: testConfig,
});
