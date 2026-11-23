import type { StorybookConfig } from "@storybook/react-vite";
import remarkGfm from "remark-gfm";

import { previewHead } from "./theme/preview-paint.ts";

const STORY_FILES = "**/*.@(mdx|stories.tsx)";

const config: StorybookConfig = {
  addons: [
    {
      name: "@storybook/addon-docs",
      options: { mdxPluginOptions: { mdxCompileOptions: { remarkPlugins: [remarkGfm] } } },
    },
    "@storybook/addon-a11y",
    "@storybook/addon-vitest",
  ],
  core: {
    builder: {
      name: "@storybook/builder-vite",
      options: { viteConfigPath: "apps/osmoz-css/vite.config.ts" },
    },
    disableTelemetry: true,
  },
  framework: "@storybook/react-vite",
  previewHead,
  stories: [
    {
      directory: "./pages",
      files: "*.mdx",
      titlePrefix: "Osmoz",
    },
    {
      directory: "../packages/ui/src",
      files: STORY_FILES,
      titlePrefix: "Osmoz",
    },
    {
      directory: "../apps/osmoz-css/src/components/ui",
      files: STORY_FILES,
      titlePrefix: "osmoz.css",
    },
  ],
};

export default config;
