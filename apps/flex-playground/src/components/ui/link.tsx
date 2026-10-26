import { Link as BaseLink } from "@osmoz/ui/link";
import { createLink } from "@tanstack/react-router";
import type { ComponentProps, ReactElement } from "react";

import { cn } from "@/lib/cn";

const VARIANT_CLASSES = {
  inline: "text-primary hover:text-accent-foreground",
  quiet: "text-control text-muted-foreground hover:text-foreground",
} as const;

type StyledLinkProps = ComponentProps<typeof BaseLink> & {
  variant?: keyof typeof VARIANT_CLASSES;
};

const StyledLink = ({
  className,
  newTab,
  newTabHint,
  variant = "inline",
  ...props
}: StyledLinkProps): ReactElement => {
  const classes = cn(
    "rounded-xs underline underline-offset-3 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
    VARIANT_CLASSES[variant],
    className,
  );

  return newTab ? (
    <BaseLink
      {...props}
      className={classes}
      newTab
      newTabHint={<span className="sr-only"> {newTabHint}</span>}
    />
  ) : (
    <BaseLink {...props} className={classes} />
  );
};

export const Link = createLink(StyledLink);
