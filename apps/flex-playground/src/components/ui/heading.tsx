import { Heading as BaseHeading } from "@osmoz/ui/heading";
import type { ComponentProps, ReactElement } from "react";

import { cn } from "@/lib/cn";

import { TYPOGRAPHY_CLASSES } from "./typography-classes";
import type { TypographyRole } from "./typography-classes";

interface HeadingProps extends ComponentProps<typeof BaseHeading> {
  variant?: Extract<TypographyRole, "title" | "overline" | "label">;
}

export const Heading = ({ className, variant = "title", ...props }: HeadingProps): ReactElement => (
  <BaseHeading {...props} className={cn(TYPOGRAPHY_CLASSES[variant], className)} />
);
