import type { StorybookConfig } from "@storybook/react-vite";
import remarkGfm from "remark-gfm";

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
      options: { viteConfigPath: "apps/flex-playground/vite.config.ts" },
    },
    disableTelemetry: true,
  },
  framework: "@storybook/react-vite",
  stories: [
    { directory: "../packages/ui/src", files: STORY_FILES, titlePrefix: "UI" },
    {
      directory: "../apps/flex-playground/src/components/ui",
      files: STORY_FILES,
      titlePrefix: "Flux",
    },
  ],
};

export default config;
