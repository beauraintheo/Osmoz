import { DocsContainer } from "@storybook/addon-docs/blocks";
import type { DocsContainerProps } from "@storybook/addon-docs/blocks";
import { useLayoutEffect, useRef, useState } from "react";
import type { PropsWithChildren, ReactElement } from "react";
import { themes } from "storybook/theming";
import type { ThemeVars } from "storybook/theming";

import { docsTheme } from "./docs-theme";
import { useThemeStore } from "./use-theme-store";

import osmozTheme from "@osmoz/brand/osmoz-theme.css?inline";
import "./osmoz-docs-container.css";

export const OsmozDocsContainer = ({
  children,
  context,
}: PropsWithChildren<DocsContainerProps>): ReactElement => {
  const mode = useThemeStore((state) => state.resolved);
  const [theme, setTheme] = useState<ThemeVars>(themes.light);
  const page = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (page.current !== null) {
      setTheme(docsTheme(page.current, mode));
    }
  }, [mode]);

  return (
    <div
      data-theme={`osmoz-${mode}`}
      ref={page}
      style={{
        background: "var(--background)",
        fontFamily: theme.fontBase,
        minHeight: "100vh",
      }}
    >
      <style>{osmozTheme}</style>
      <DocsContainer context={context} theme={theme}>
        {children}
      </DocsContainer>
    </div>
  );
};
