import {
  ArgTypes,
  Canvas,
  Description,
  DocsContext,
  Heading,
  Source,
  Subheading,
  Title,
  useOf,
} from "@storybook/addon-docs/blocks";
import { useContext, useEffect, useState } from "react";
import type { ReactElement } from "react";
import type { PreparedStory } from "storybook/internal/types";

import { breadcrumbParts } from "../../manager/breadcrumb-parts";
import { sentenceCase } from "../blocks/attributes/sentence-case";
import { Token, Tokens } from "../blocks/tokens/tokens";
import { DocsAnchor } from "../docs-anchor";
import { addedProps, importSnippet, pageStories, pageTokens, uiStoryId } from "./page-data";
import { PAGE_MESSAGES } from "./page-messages";

interface UiComponent {
  argTypes: Readonly<Record<string, unknown>>;
  id: string;
}

type UiLookup = { status: "loading" } | { status: "done"; ui: UiComponent | undefined };

interface ExamplesProps {
  stories: PreparedStory[];
  title: string;
}

const Examples = ({ stories, title }: ExamplesProps): ReactElement | null =>
  stories.length === 0 ? null : (
    <>
      <Heading>{title}</Heading>
      {stories.map((story) => (
        <div key={story.id}>
          <Subheading>{sentenceCase(story.name)}</Subheading>
          <Description of={story.moduleExport} />
          <Canvas of={story.moduleExport} />
        </div>
      ))}
    </>
  );

export const AppComponentPage = (): ReactElement => {
  const context = useContext(DocsContext);
  const { preparedMeta } = useOf("meta", ["meta"]);
  const [lookup, setLookup] = useState<UiLookup>({ status: "loading" });
  const { current: component, parents } = breadcrumbParts(preparedMeta.title);
  const [app = ""] = parents;
  const { argTypes } = context.storyById();
  const stories = pageStories(context.componentStories());
  const tokens = pageTokens(preparedMeta.parameters);
  const snippet = importSnippet(component, preparedMeta.parameters);
  const uiPage = PAGE_MESSAGES.intro.uiPage(component);

  useEffect(() => {
    const controller = new AbortController();

    const load = async (): Promise<UiComponent | undefined> => {
      const response = await fetch("./index.json", { signal: controller.signal });

      if (!response.ok) {
        throw new Error(`index.json: HTTP ${response.status}`);
      }

      const id = uiStoryId(await response.json(), component);

      if (id === undefined) {
        return undefined;
      }

      const story = await context.loadStory(id);

      return { argTypes: story.argTypes, id: story.componentId };
    };

    load()
      .then((ui) => {
        if (!controller.signal.aborted) {
          setLookup({ status: "done", ui });
        }
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          console.warn(error);
          setLookup({ status: "done", ui: undefined });
        }
      });

    return (): void => {
      controller.abort();
    };
  }, [component, context]);

  const ui = lookup.status === "done" ? lookup.ui : undefined;
  const added = addedProps(argTypes, ui?.argTypes ?? {});

  return (
    <>
      <Title>{component}</Title>
      <p>{PAGE_MESSAGES.intro.look(app, component)}</p>
      {ui === undefined ? null : (
        <p>
          {PAGE_MESSAGES.intro.contract} <DocsAnchor id={ui.id}>{uiPage}</DocsAnchor>
        </p>
      )}
      {snippet === undefined ? null : <Source code={snippet} dark language="tsx" />}
      {stories.default === undefined ? null : <Canvas of={stories.default.moduleExport} />}

      <Examples stories={stories.examples} title={PAGE_MESSAGES.examples.title} />
      <Examples stories={stories.edgeCases} title={PAGE_MESSAGES.edgeCases.title} />

      {ui === undefined ? null : (
        <>
          <Heading>{PAGE_MESSAGES.api.title}</Heading>
          <Subheading>{PAGE_MESSAGES.api.addedProps(app)}</Subheading>
          {added.length === 0 ? (
            <p>{PAGE_MESSAGES.api.none(app, component)}</p>
          ) : (
            <ArgTypes include={added} />
          )}
        </>
      )}

      {tokens.length === 0 ? null : (
        <>
          <Subheading>{PAGE_MESSAGES.tokens.title}</Subheading>
          <p>{PAGE_MESSAGES.tokens.intro}</p>
          <Tokens>
            {tokens.map(({ name, role }) => (
              <Token key={name} name={name}>
                {role}
              </Token>
            ))}
          </Tokens>
        </>
      )}
    </>
  );
};
