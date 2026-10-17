import { resolve } from "node:path";

import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import type { ViteUserConfig } from "vite-plus";

import { testConfig } from "./test-config.ts";

export interface AppConfigOptions {
  root: string;
}

export const defineAppConfig = ({ root }: AppConfigOptions): ViteUserConfig => ({
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
      indexToken: "home",
      routesDirectory: resolve(root, "src/routes"),
      generatedRouteTree: resolve(root, "src/route-tree.gen.ts"),
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
