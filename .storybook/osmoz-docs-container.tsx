import { DocsContainer } from "@storybook/addon-docs/blocks";
import type { DocsContainerProps } from "@storybook/addon-docs/blocks";
import type { PropsWithChildren, ReactElement } from "react";

import { sectionOf, sectionOfEntry } from "./theme-stores";
import { ThemeSurface } from "./theme-surface";

import osmozClasses from "./osmoz-docs-classes.css?inline";
import "./osmoz-docs-container.css";

export const OsmozDocsContainer = ({
  children,
  context,
}: PropsWithChildren<DocsContainerProps>): ReactElement => {
  const story = context.componentStories()[0];
  const section =
    story === undefined
      ? sectionOfEntry(new URLSearchParams(window.location.search).get("id"))
      : sectionOf(story.parameters.app);

  return (
    <ThemeSurface section={section} variant="page">
      {(theme) => (
        <>
          <style>{osmozClasses}</style>
          <DocsContainer context={context} theme={theme}>
            {children}
          </DocsContainer>
        </>
      )}
    </ThemeSurface>
  );
};
