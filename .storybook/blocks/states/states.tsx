import { Story, useOf } from "@storybook/addon-docs/blocks";
import { useEffect, useRef, useState } from "react";
import type { ReactElement, ReactNode } from "react";
import type { ModuleExport } from "storybook/internal/types";

import { formatAttribute, readAttributes } from "./read-attributes";
import type { Attribute } from "./read-attributes";

import "./states.css";

interface StatesProps {
  children: ReactNode;
}

interface StateProps {
  children: ReactNode;
  of: ModuleExport;
}

export const States = ({ children }: StatesProps): ReactElement => (
  <div className="osmoz-states sb-unstyled">{children}</div>
);

export const State = ({ children, of }: StateProps): ReactElement => {
  const { story } = useOf(of, ["story"]);
  const preview = useRef<HTMLDivElement>(null);
  const [attributes, setAttributes] = useState<Attribute[]>([]);

  useEffect(() => {
    const element = preview.current;

    if (element === null) {
      return;
    }

    const read = (): void => {
      const rendered = element.querySelector("[data-name]")?.firstElementChild ?? null;

      setAttributes(rendered === null ? [] : readAttributes(rendered));
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
  }, []);

  return (
    <section className="osmoz-state">
      <h3 className="osmoz-state-title">{story.name}</h3>
      <div className="osmoz-state-preview" ref={preview}>
        <Story of={of} />
      </div>
      <ul className="osmoz-state-attributes">
        {attributes.map((attribute) => (
          <li key={attribute.name}>
            <code>{formatAttribute(attribute)}</code>
          </li>
        ))}
      </ul>
      <div className="osmoz-state-behavior">{children}</div>
    </section>
  );
};
