import type { ComponentProps, ReactElement, ReactNode } from "react";

type LinkProps = Omit<ComponentProps<"a">, "target"> &
  ({ newTab: true; newTabHint: ReactNode } | { newTab?: false; newTabHint?: never });

export const Link = ({ children, newTab, newTabHint, ...props }: LinkProps): ReactElement => (
  <a {...props} target={newTab ? "_blank" : undefined}>
    {children}
    {newTab ? newTabHint : null}
  </a>
);
