import type { ComponentProps, ReactElement } from "react";

import { cn } from "@/lib/cn";

const DIRECTION_CLASSES = {
  column: "flex-col",
  row: "flex-row",
} as const;

const GAP_CLASSES = {
  0: "gap-0",
  1: "gap-1",
  10: "gap-10",
  12: "gap-12",
  16: "gap-16",
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  5: "gap-5",
  6: "gap-6",
  8: "gap-8",
} as const;

const ALIGN_CLASSES = {
  baseline: "items-baseline",
  center: "items-center",
  end: "items-end",
  start: "items-start",
  stretch: "items-stretch",
} as const;

const JUSTIFY_CLASSES = {
  between: "justify-between",
  center: "justify-center",
  end: "justify-end",
  start: "justify-start",
} as const;

interface StackProps extends ComponentProps<"div"> {
  align?: keyof typeof ALIGN_CLASSES;
  direction?: keyof typeof DIRECTION_CLASSES;
  gap: keyof typeof GAP_CLASSES;
  justify?: keyof typeof JUSTIFY_CLASSES;
}

export const Stack = ({
  align = "stretch",
  className,
  direction = "column",
  gap,
  justify = "start",
  ...props
}: StackProps): ReactElement => (
  <div
    {...props}
    className={cn(
      "flex",
      DIRECTION_CLASSES[direction],
      GAP_CLASSES[gap],
      ALIGN_CLASSES[align],
      JUSTIFY_CLASSES[justify],
      className,
    )}
  />
);
