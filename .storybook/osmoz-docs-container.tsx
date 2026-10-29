import { DocsContainer } from "@storybook/addon-docs/blocks";
import type { DocsContainerProps } from "@storybook/addon-docs/blocks";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { PropsWithChildren, ReactElement } from "react";
import { GLOBALS_UPDATED } from "storybook/internal/core-events";
import { themes } from "storybook/theming";
import type { ThemeVars } from "storybook/theming";

import { docsTheme, toMode } from "./docs-theme";
import type { Mode } from "./docs-theme";

import osmozTheme from "@osmoz/brand/osmoz-theme.css?inline";
import "./osmoz-docs-container.css";

const readMode = (context: DocsContainerProps["context"]): Mode => {
  const story = context.componentStories()[0];

  return story === undefined ? "light" : toMode(context.getStoryContext(story).globals.theme);
};

export const OsmozDocsContainer = ({
  children,
  context,
}: PropsWithChildren<DocsContainerProps>): ReactElement => {
  const [mode, setMode] = useState<Mode>(() => readMode(context));
  const [theme, setTheme] = useState<ThemeVars>(themes.light);
  const page = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const follow = ({ globals }: { globals: Record<string, unknown> }): void => {
      setMode(toMode(globals.theme));
    };

    context.channel.on(GLOBALS_UPDATED, follow);

    return (): void => {
      context.channel.off(GLOBALS_UPDATED, follow);
    };
  }, [context]);

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
