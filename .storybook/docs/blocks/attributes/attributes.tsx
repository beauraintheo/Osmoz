import { DocsContext, Story } from "@storybook/addon-docs/blocks";
import { useContext, useEffect, useRef, useState } from "react";
import type { Dispatch, ReactElement, SetStateAction } from "react";
import type { ModuleExport } from "storybook/internal/types";

import { storyAnchor } from "../../docs-link";
import { ATTRIBUTES_MESSAGES } from "./attributes-messages";
import { exposedAttributes, replaceReading } from "./exposed-attributes";
import type { StoryReading } from "./exposed-attributes";
import { readAttributes, storyRoot } from "./read-attributes";
import { sentenceCase } from "./sentence-case";

import "./attributes.css";

type Readings = Readonly<Record<string, StoryReading>>;

interface AttributesProps {
  stories: ModuleExport[];
}

interface ReadingProps {
  id: string;
  name: string;
  of: ModuleExport;
  setReadings: Dispatch<SetStateAction<Readings>>;
}

interface ValueProps {
  value: string;
}

const Value = ({ value }: ValueProps): ReactElement =>
  value === "" ? (
    <span className="osmoz-attribute-present">{ATTRIBUTES_MESSAGES.present}</span>
  ) : (
    <code>{ATTRIBUTES_MESSAGES.value(value)}</code>
  );

const Reading = ({ id, name, of, setReadings }: ReadingProps): ReactElement => {
  const preview = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = preview.current;

    if (element === null) {
      return;
    }

    const read = (): void => {
      const container = element.querySelector("[data-name]");
      const rendered = container === null ? null : storyRoot(container);
      const attributes = rendered === null ? [] : readAttributes(rendered);

      setReadings((current) => replaceReading(current, { attributes, story: { id, name } }));
    };

    read();

    const observer = new MutationObserver(read);

    observer.observe(element, {
      attributes: true,
      childList: true,
      subtree: true,
    });

    return (): void => {
      observer.disconnect();
    };
  }, [id, name, setReadings]);

  return (
    <div hidden ref={preview}>
      <Story of={of} />
    </div>
  );
};

export const Attributes = ({ stories }: AttributesProps): ReactElement => {
  const context = useContext(DocsContext);
  const resolved = stories.map((of) => {
    const { story } = context.resolveOf(of, ["story"]);

    return {
      id: story.id,
      name: story.name,
      of,
    };
  });
  const [readings, setReadings] = useState<Readings>({});
  const attributes = exposedAttributes(resolved.flatMap(({ id }) => readings[id] ?? []));

  return (
    <div className="osmoz-attributes">
      <table>
        <thead>
          <tr>
            <th scope="col">{ATTRIBUTES_MESSAGES.columns.attribute}</th>
            <th scope="col">{ATTRIBUTES_MESSAGES.columns.value}</th>
            <th scope="col">{ATTRIBUTES_MESSAGES.columns.stories}</th>
          </tr>
        </thead>
        <tbody>
          {attributes.flatMap(({ name, values }) =>
            values.map(({ stories: setIn, value }, position) => (
              <tr key={`${name}=${value}`}>
                {position === 0 ? (
                  <th rowSpan={values.length} scope="row">
                    <code>{name}</code>
                  </th>
                ) : null}
                <td>
                  <Value value={value} />
                </td>
                <td>
                  <ul className="osmoz-attribute-stories">
                    {setIn.map(({ id, name: storyName }) => (
                      <li key={id}>
                        <a className="osmoz-docs-link" href={storyAnchor(id)}>
                          {sentenceCase(storyName)}
                        </a>
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            )),
          )}
        </tbody>
      </table>
      {resolved.map(({ id, name, of }) => (
        <Reading id={id} key={id} name={name} of={of} setReadings={setReadings} />
      ))}
    </div>
  );
};
