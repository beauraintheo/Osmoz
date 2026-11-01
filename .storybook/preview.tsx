import type { Decorator, Preview } from "@storybook/react-vite";

import { Guideline, Guidelines } from "./blocks/guidelines/guidelines";
import { Key, Keyboard } from "./blocks/keyboard/keyboard";
import { State, States } from "./blocks/states/states";
import { Token, Tokens } from "./blocks/tokens/tokens";
import { OsmozDocsContainer } from "./osmoz-docs-container";
import { sectionOf } from "./theme-stores";
import type { Section } from "./theme-stores";
import { ThemeSurface } from "./theme-surface";
import type { Variant } from "./theme-surface";

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
    docs: {
      components: {
        Guideline,
        Guidelines,
        Key,
        Keyboard,
        State,
        States,
        Token,
        Tokens,
      },
      container: OsmozDocsContainer,
    },
    options: {
      storySort: {
        order: ["Osmoz", ["Introduction", "Using a component", "Brand"], "Flux", ["Introduction"]],
      },
    },
  },
};

export default preview;
