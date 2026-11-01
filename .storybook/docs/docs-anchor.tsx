import { DocsContext } from "@storybook/addon-docs/blocks";
import { useContext } from "react";
import type { MouseEvent, ReactElement, ReactNode } from "react";
import { NAVIGATE_URL } from "storybook/internal/core-events";

import { docsPath, isPlainClick } from "./docs-link";

interface DocsAnchorProps {
  children: ReactNode;
  className?: string;
  id: string;
}

export const DocsAnchor = ({ children, className, id }: DocsAnchorProps): ReactElement => {
  const context = useContext(DocsContext);
  const path = docsPath(id);
  const go = (event: MouseEvent<HTMLAnchorElement>): void => {
    if (isPlainClick(event)) {
      event.preventDefault();
      context.channel.emit(NAVIGATE_URL, path);
    }
  };

  return (
    <a className={className} href={`./${path}`} onClick={go} target="_top">
      {children}
    </a>
  );
};
