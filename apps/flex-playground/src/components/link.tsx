import { Link as BaseLink } from "@osmoz/ui/link";
import { createLink } from "@tanstack/react-router";
import type { ComponentProps, ReactElement } from "react";

import { cn } from "@/lib/cn";

const VARIANT_CLASSES = {
  inline: "text-primary hover:text-accent-foreground",
  quiet: "text-control text-muted-foreground hover:text-foreground",
} as const;

interface StyledLinkProps extends Omit<ComponentProps<typeof BaseLink>, "newTabHint"> {
  variant?: keyof typeof VARIANT_CLASSES;
  newTabLabel?: string;
}

const StyledLink = ({
  variant = "inline",
  newTabLabel,
  className,
  ...props
}: StyledLinkProps): ReactElement => (
  <BaseLink
    {...props}
    newTabHint={newTabLabel ? <span className="sr-only"> ({newTabLabel})</span> : undefined}
    className={cn(
      "rounded-xs underline underline-offset-3 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
      VARIANT_CLASSES[variant],
      className,
    )}
  />
);

export const Link = createLink(StyledLink);
