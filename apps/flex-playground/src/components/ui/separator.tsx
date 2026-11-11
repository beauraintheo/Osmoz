import { Separator as BaseSeparator } from "@osmoz/ui/separator";
import type { ComponentProps, ReactElement } from "react";

import { cn } from "@/lib/cn";

const ORIENTATION_CLASSES = {
  horizontal: "border-t",
  vertical: "self-stretch border-l",
} as const;

type StyledSeparatorProps = ComponentProps<typeof BaseSeparator>;

export const Separator = ({
  className,
  orientation = "horizontal",
  ...props
}: StyledSeparatorProps): ReactElement => (
  <BaseSeparator
    {...props}
    className={cn("shrink-0 border-border", ORIENTATION_CLASSES[orientation], className)}
    orientation={orientation}
  />
);
