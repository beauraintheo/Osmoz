import { ArgTypes, Canvas, DocsContext, Heading, Title, useOf } from "@storybook/addon-docs/blocks";
import { composeStory } from "@storybook/react-vite";
import { useContext, useEffect, useState } from "react";
import type { ReactElement } from "react";
import type { ModuleExport } from "storybook/internal/types";

import { breadcrumbParts } from "../../manager/breadcrumb-parts";
import { Token, Tokens } from "../blocks/tokens/tokens";
import { DocsAnchor } from "../docs-anchor";
import { addedProps, argOptions, pageTokens, uiStoryId } from "./page-data";
import { PAGE_MESSAGES } from "./page-messages";

import "./app-component-page.css";

interface UiComponent {
  argTypes: Readonly<Record<string, unknown>>;
  id: string;
}

type UiLookup = { status: "loading" } | { status: "done"; ui: UiComponent | undefined };

interface CellProps {
  args: Readonly<Record<string, unknown>>;
  meta: ModuleExport;
  story: ModuleExport;
}

const REST = {};

const Cell = ({ args, meta, story }: CellProps): ReactElement => {
  const render = composeStory(story, meta);

  return <div className="osmoz-matrix-cell">{render(args)}</div>;
};

const variantArgs = (variant: string | undefined): Readonly<Record<string, unknown>> =>
  variant === undefined ? {} : { variant };

export const AppComponentPage = (): ReactElement => {
  const context = useContext(DocsContext);
  const { csfFile, preparedMeta } = useOf("meta", ["meta"]);
  const [lookup, setLookup] = useState<UiLookup>({ status: "loading" });
  const { current: component, parents } = breadcrumbParts(preparedMeta.title);
  const app = parents.join("/");
  const meta: ModuleExport = csfFile.moduleExports.default;
  const stories = context.componentStories();
  const { argTypes } = context.storyById();
  const states = stories.filter((story) => story.tags.includes("state"));
  const usage = stories.find((story) => story.tags.includes("usage"));
  const variants = argOptions(argTypes.variant);
  const sizes = argOptions(argTypes.size);
  const tokens = pageTokens(preparedMeta.parameters);
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

      <Heading>{PAGE_MESSAGES.matrix.title}</Heading>
      <div className="osmoz-matrix sb-unstyled">
        <table>
          <thead>
            <tr>
              <th scope="col">{PAGE_MESSAGES.matrix.variant}</th>
              <th scope="col">{PAGE_MESSAGES.matrix.rest}</th>
              {states.map((state) => (
                <th key={state.id} scope="col">
                  {state.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(variants.length === 0 ? [undefined] : variants).map((variant) => (
              <tr key={variant ?? component}>
                <th scope="row">
                  <code>{variant ?? component}</code>
                </th>
                <td>
                  <Cell args={variantArgs(variant)} meta={meta} story={REST} />
                </td>
                {states.map((state) => (
                  <td key={state.id}>
                    <Cell args={variantArgs(variant)} meta={meta} story={state.moduleExport} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sizes.length === 0 ? null : (
        <>
          <Heading>{PAGE_MESSAGES.sizes.title}</Heading>
          <ul className="osmoz-sizes sb-unstyled">
            {sizes.map((size) => (
              <li key={size}>
                <Cell args={{ size }} meta={meta} story={REST} />
                <code>{size}</code>
              </li>
            ))}
          </ul>
        </>
      )}

      {usage === undefined ? null : (
        <>
          <Heading>{PAGE_MESSAGES.usage.title}</Heading>
          <Canvas of={usage.moduleExport} sourceState="shown" />
        </>
      )}

      {ui === undefined ? null : (
        <>
          <Heading>{PAGE_MESSAGES.addedProps.title(app)}</Heading>
          {added.length === 0 ? (
            <p>{PAGE_MESSAGES.addedProps.none(app, component)}</p>
          ) : (
            <ArgTypes include={added} />
          )}
        </>
      )}

      {tokens.length === 0 ? null : (
        <>
          <Heading>{PAGE_MESSAGES.tokens.title}</Heading>
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
