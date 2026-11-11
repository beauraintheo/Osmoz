import { useOf } from "@storybook/addon-docs/blocks";
import type { ReactElement, ReactNode } from "react";
import type { ModuleExports } from "storybook/internal/types";

import { DocsAnchor } from "../../docs-anchor";
import { componentName } from "../../docs-link";
import { GUIDELINES_MESSAGES } from "./guidelines-messages";

import "./guidelines.css";

interface GuidelinesProps {
  children: ReactNode;
}

interface GuidelineProps {
  children?: ReactNode;
  use?: ModuleExports;
  when: string;
}

interface VerdictProps {
  use: ModuleExports | "meta";
}

const Verdict = ({ use }: VerdictProps): ReactElement => {
  const { preparedMeta } = useOf(use, ["meta"]);
  const name = componentName(preparedMeta.title);

  if (use === "meta") {
    return <code className="osmoz-guideline-verdict">{name}</code>;
  }

  return (
    <DocsAnchor className="osmoz-guideline-verdict osmoz-docs-link" id={preparedMeta.id}>
      <code>{name}</code>
    </DocsAnchor>
  );
};

export const Guidelines = ({ children }: GuidelinesProps): ReactElement => (
  <table className="osmoz-guidelines">
    <thead>
      <tr>
        <th scope="col">{GUIDELINES_MESSAGES.columns.situation}</th>
        <th scope="col">{GUIDELINES_MESSAGES.columns.use}</th>
      </tr>
    </thead>
    <tbody>{children}</tbody>
  </table>
);

export const Guideline = ({ children, use, when }: GuidelineProps): ReactElement => (
  <tr>
    <td>
      <span className="osmoz-guideline-when">{when}</span>
      {children === undefined ? null : <span className="osmoz-guideline-why">{children}</span>}
    </td>
    <td>
      <Verdict use={use ?? "meta"} />
    </td>
  </tr>
);
