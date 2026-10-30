import { join } from "node:path";

import { defineAppConfig } from "@osmoz/config/define-app-config";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vite-plus";
import type { BrowserConfigOptions } from "vite-plus/test/node";

const flux = defineAppConfig({
  reactCompiler: false,
  root: join(import.meta.dirname, "apps/flex-playground"),
});

const chromium = (): BrowserConfigOptions => ({
  enabled: true,
  headless: true,
  instances: [{ browser: "chromium" }],
  provider: playwright(),
});

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
        plugins: [flux.plugins, storybookTest({ configDir: ".storybook" })],
        resolve: flux.resolve,
        test: { browser: chromium(), name: "stories" },
      },
      {
        test: {
          browser: chromium(),
          include: [".storybook/**/*.test.ts"],
          name: "storybook-config",
        },
      },
    ],
  },
});
