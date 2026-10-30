import type { Decorator, Preview } from "@storybook/react-vite";

import { Guideline, Guidelines } from "./blocks/guidelines/guidelines";
import { Key, Keyboard } from "./blocks/keyboard/keyboard";
import { State, States } from "./blocks/states/states";
import { Token, Tokens } from "./blocks/tokens/tokens";
import { OsmozDocsContainer } from "./osmoz-docs-container";

import fluxTheme from "../apps/flex-playground/src/theme/theme.css?inline";

const APP_STYLES: Readonly<Record<string, string>> = { flux: fluxTheme };

const withAppTheme: Decorator = (Story, { globals, parameters }) => {
  const app: unknown = parameters.app;
  const theme: unknown = globals.theme;
  const style = typeof app === "string" ? APP_STYLES[app] : undefined;

  if (style === undefined) {
    return <Story />;
  }

  return (
    <div
      data-app-theme=""
      data-theme={typeof theme === "string" ? theme : "light"}
      style={{
        background: "var(--background)",
        color: "var(--foreground)",
        padding: "1rem",
      }}
    >
      <style>{style}</style>
      <Story />
    </div>
  );
};

const preview: Preview = {
  decorators: [withAppTheme],
  globalTypes: {
    theme: {
      description: "App theme",
      toolbar: {
        dynamicTitle: true,
        icon: "paintbrush",
        items: ["light", "dark"],
      },
    },
  },
  initialGlobals: { theme: "light" },
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
  },
};

export default preview;
