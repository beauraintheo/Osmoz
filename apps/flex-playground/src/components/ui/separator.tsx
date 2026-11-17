import { Separator as BaseSeparator } from "@osmoz/ui/separator";
import type { ComponentProps, ReactElement } from "react";

import { cn } from "@/lib/cn";

const ORIENTATION_CLASSES = {
  horizontal: "border-t",
  vertical: "border-l",
} as const;

const VERTICAL_LENGTH_CLASSES = {
  full: "self-stretch",
  inset: "h-5 self-center",
} as const;

interface SeparatorProps extends ComponentProps<typeof BaseSeparator> {
  length?: keyof typeof VERTICAL_LENGTH_CLASSES;
}

export const Separator = ({
  className,
  length = "full",
  orientation = "horizontal",
  ...props
}: SeparatorProps): ReactElement => (
  <BaseSeparator
    {...props}
    className={cn(
      "shrink-0 border-border",
      ORIENTATION_CLASSES[orientation],
      orientation === "vertical" && VERTICAL_LENGTH_CLASSES[length],
      className,
    )}
    orientation={orientation}
  />
);
