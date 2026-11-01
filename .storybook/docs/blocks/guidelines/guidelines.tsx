import { Story, useOf } from "@storybook/addon-docs/blocks";
import type { ReactElement, ReactNode } from "react";
import type { ModuleExport, ModuleExports } from "storybook/internal/types";

import { DocsAnchor } from "../../docs-anchor";
import { componentName } from "../../docs-link";

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
  const name = componentName(preparedMeta.title);

  if (use === "meta") {
    return <code className="osmoz-guideline-verdict">{name}</code>;
  }

  return (
    <DocsAnchor className="osmoz-guideline-verdict" id={preparedMeta.id}>
      <ArrowIcon />
      <code>{name}</code>
    </DocsAnchor>
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
