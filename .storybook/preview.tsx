import type { Decorator, Preview } from "@storybook/react-vite";

import { AppComponentPage } from "./docs/app-component-page/app-component-page";
import { Guideline, Guidelines } from "./docs/blocks/guidelines/guidelines";
import { Key, Keyboard } from "./docs/blocks/keyboard/keyboard";
import { State, States } from "./docs/blocks/states/states";
import { Token, Tokens } from "./docs/blocks/tokens/tokens";
import { DocsContainer } from "./docs/docs-container";
import { sectionOf } from "./theme/theme-stores";
import type { Section } from "./theme/theme-stores";
import { ThemeSurface } from "./theme/theme-surface";
import type { Variant } from "./theme/theme-surface";

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
      container: DocsContainer,
      page: AppComponentPage,
    },
    options: {
      storySort: {
        order: ["Osmoz", ["Introduction", "Using a component", "Brand"], "Flux", ["Introduction"]],
      },
    },
  },
};

export default preview;
