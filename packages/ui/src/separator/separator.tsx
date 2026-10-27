import type { ComponentProps, ReactElement } from "react";

interface SeparatorProps extends Omit<ComponentProps<"hr">, "children" | "role"> {
  decorative?: boolean;
  orientation?: "horizontal" | "vertical";
}

export const Separator = ({
  decorative = false,
  orientation = "horizontal",
  ...props
}: SeparatorProps): ReactElement => (
  <hr
    {...props}
    aria-orientation={decorative ? undefined : orientation}
    data-orientation={orientation}
    role={decorative ? "none" : undefined}
  />
);
