import { DocsContext, Story, useOf } from "@storybook/addon-docs/blocks";
import { useContext } from "react";
import type { MouseEvent, ReactElement, ReactNode } from "react";
import { NAVIGATE_URL } from "storybook/internal/core-events";
import type { ModuleExport, ModuleExports } from "storybook/internal/types";

import { componentName, docsPath, isPlainClick } from "./docs-link";

import "./guidelines.css";

interface GuidelinesProps {
  children: ReactNode;
}

interface GuidelineProps {
  children?: ReactNode;
  preview?: ModuleExport;
  use?: ModuleExports;
  when: string;
}

interface VerdictProps {
  use: ModuleExports | "meta";
}

const ArrowIcon = (): ReactElement => (
  <svg aria-hidden="true" fill="none" height="14" viewBox="0 0 24 24" width="14">
    <path
      d="M5 12h14M13 6l6 6-6 6"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.25"
    />
  </svg>
);

const Verdict = ({ use }: VerdictProps): ReactElement => {
  const { preparedMeta } = useOf(use, ["meta"]);
  const context = useContext(DocsContext);
  const name = componentName(preparedMeta.title);

  if (use === "meta") {
    return <code className="osmoz-guideline-verdict">{name}</code>;
  }

  const path = docsPath(preparedMeta.id);
  const go = (event: MouseEvent<HTMLAnchorElement>): void => {
    if (isPlainClick(event)) {
      event.preventDefault();
      context.channel.emit(NAVIGATE_URL, path);
    }
  };

  return (
    <a
      className="osmoz-guideline-verdict"
      data-elsewhere=""
      href={`./${path}`}
      onClick={go}
      target="_top"
    >
      <ArrowIcon />
      <code>{name}</code>
    </a>
  );
};

export const Guidelines = ({ children }: GuidelinesProps): ReactElement => (
  <ul className="osmoz-guidelines sb-unstyled">{children}</ul>
);

export const Guideline = ({ children, preview, use, when }: GuidelineProps): ReactElement => (
  <li className="osmoz-guideline">
    <div className="osmoz-guideline-case">
      <p className="osmoz-guideline-when">{when}</p>
      {children === undefined ? null : <div className="osmoz-guideline-why">{children}</div>}
    </div>
    <div className="osmoz-guideline-answer">
      {preview === undefined ? null : (
        <div className="osmoz-guideline-preview">
          <Story of={preview} />
        </div>
      )}
      <Verdict use={use ?? "meta"} />
    </div>
  </li>
);
