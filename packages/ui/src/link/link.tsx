import type { ComponentProps, ReactElement, ReactNode } from "react";

import { resolveLinkBehavior } from "./link-behavior.ts";

interface LinkProps extends ComponentProps<"a"> {
  newTabHint?: ReactNode;
}

export const Link = ({ newTabHint, children, ...props }: LinkProps): ReactElement => {
  const { rel, external, newTab } = resolveLinkBehavior(props);

  return (
    <a {...props} rel={rel} data-external={external || undefined}>
      {children}
      {newTab ? newTabHint : null}
    </a>
  );
};
