import { join } from "node:path";

import { defineAppConfig } from "@osmoz/config/define-app-config";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vite-plus";
import type { BrowserConfigOptions } from "vite-plus/test/node";

const osmozCss = defineAppConfig({
  reactCompiler: false,
  root: join(import.meta.dirname, "apps/osmoz-css"),
});

const chromium = (): BrowserConfigOptions => ({
  enabled: true,
  headless: true,
  instances: [{ browser: "chromium" }],
  provider: playwright(),
});

const prebundled = { include: ["@storybook/react-vite", "zod/mini"] };

export default defineConfig({
  test: {
    coverage: {
      exclude: ["**/*.stories.tsx", "**/*.test.ts", ".storybook/main.ts"],
      include: ["packages/ui/src/**/*.tsx", "apps/*/src/components/ui/*.tsx", ".storybook/**/*.ts"],
      provider: "v8",
      reportsDirectory: "coverage/storybook",
      thresholds: {
        branches: 100,
        functions: 100,
        lines: 100,
        statements: 100,
      },
    },
    projects: [
      {
        optimizeDeps: prebundled,
        plugins: [osmozCss.plugins, storybookTest({ configDir: ".storybook" })],
        resolve: osmozCss.resolve,
        test: { browser: chromium(), name: "stories" },
      },
      {
        optimizeDeps: prebundled,
        test: {
          browser: chromium(),
          include: [".storybook/**/*.test.ts"],
          name: "storybook-config",
        },
      },
    ],
  },
});
