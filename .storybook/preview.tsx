import type { Decorator, Preview } from "@storybook/react-vite";
import type { ReactElement, ReactNode } from "react";

import { Guideline, Guidelines } from "./blocks/guidelines/guidelines";
import { Key, Keyboard } from "./blocks/keyboard/keyboard";
import { State, States } from "./blocks/states/states";
import { Token, Tokens } from "./blocks/tokens/tokens";
import { OsmozDocsContainer } from "./osmoz-docs-container";
import { useThemeStore } from "./use-theme-store";

import fluxTheme from "../apps/flex-playground/src/theme/theme.css?inline";

const APP_STYLES: Readonly<Record<string, string>> = { flux: fluxTheme };

interface AppThemeProps {
  children: ReactNode;
  fullHeight: boolean;
  style: string;
}

const AppTheme = ({ children, fullHeight, style }: AppThemeProps): ReactElement => {
  const theme = useThemeStore((state) => state.resolved);

  return (
    <div
      data-app-theme=""
      data-theme={theme}
      style={{
        background: "var(--background)",
        boxSizing: "border-box",
        color: "var(--foreground)",
        minHeight: fullHeight ? "100vh" : undefined,
        padding: "1rem",
      }}
    >
      <style>{style}</style>
      {children}
    </div>
  );
};

const withAppTheme: Decorator = (Story, { parameters, viewMode }) => {
  const app: unknown = parameters.app;
  const style = typeof app === "string" ? APP_STYLES[app] : undefined;

  if (style === undefined) {
    return <Story />;
  }

  return (
    <AppTheme fullHeight={viewMode === "story"} style={style}>
      <Story />
    </AppTheme>
  );
};

const preview: Preview = {
  decorators: [withAppTheme],
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
