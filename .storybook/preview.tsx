import type { Decorator, Preview } from "@storybook/react-vite";

import { AppComponentPage } from "./docs/app-component-page/app-component-page";
import { Attributes } from "./docs/blocks/attributes/attributes";
import { Guideline, Guidelines } from "./docs/blocks/guidelines/guidelines";
import { Key, Keyboard } from "./docs/blocks/keyboard/keyboard";
import { Token, Tokens } from "./docs/blocks/tokens/tokens";
import { DocsContainer } from "./docs/docs-container";
import { functionName, showInSnippet } from "./docs/snippet-props";
import { sectionOf } from "./theme/theme-stores";
import type { Section } from "./theme/theme-stores";
import { ThemeSurface } from "./theme/theme-surface";
import type { Variant } from "./theme/theme-surface";

import "./docs/demo/demo.css";

type ViewMode = "docs" | "story";

const STORY_SURFACES: Readonly<Record<Section, Readonly<Record<ViewMode, Variant | undefined>>>> = {
  flux: { docs: "block", story: "canvas" },
  osmoz: { docs: undefined, story: "bare" },
};

const withThemeSurface: Decorator = (Story, { parameters, viewMode }) => {
  const app: unknown = parameters.app;
  const section = sectionOf(app);
  const variant = STORY_SURFACES[section][viewMode];

  if (variant === undefined) {
    return <Story />;
  }

  return (
    <ThemeSurface section={section} variant={variant}>
      {() => <Story />}
    </ThemeSurface>
  );
};

const preview: Preview = {
  decorators: [withThemeSurface],
  parameters: {
    a11y: { test: "error" },
    actions: { disable: true },
    controls: { disable: true },
    docs: {
      canvas: { sourceState: "hidden" },
      components: {
        Attributes,
        Guideline,
        Guidelines,
        Key,
        Keyboard,
        Token,
        Tokens,
      },
      container: DocsContainer,
      page: AppComponentPage,
      source: { type: "dynamic" },
    },
    jsx: { filterProps: showInSnippet, functionValue: functionName },
    options: {
      storySort: {
        order: [
          "Osmoz",
          [
            "Introduction",
            "Using a component",
            "Brand",
            "Actions",
            "Navigation",
            "Feedback",
            "Display",
          ],
          "Flux",
          ["Introduction", "Actions", "Navigation", "Feedback", "Display"],
        ],
      },
    },
  },
};

export default preview;
