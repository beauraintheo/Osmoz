import { DocsContainer as BaseDocsContainer } from "@storybook/addon-docs/blocks";
import type { DocsContainerProps } from "@storybook/addon-docs/blocks";
import type { PropsWithChildren, ReactElement } from "react";

import { sectionOf, sectionOfEntry } from "../theme/theme-stores";
import { ThemeSurface } from "../theme/theme-surface";

import docsClasses from "./docs-classes.css?inline";
import "./docs-container.css";

export const DocsContainer = ({
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
          <style>{docsClasses}</style>
          <BaseDocsContainer context={context} theme={theme}>
            {children}
          </BaseDocsContainer>
        </>
      )}
    </ThemeSurface>
  );
};
