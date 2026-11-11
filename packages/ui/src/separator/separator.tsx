import { Separator as BaseSeparator } from "@base-ui/react/separator";
import type { ComponentProps, CSSProperties, ReactElement } from "react";

interface SeparatorProps extends Omit<
  ComponentProps<typeof BaseSeparator>,
  "children" | "className" | "render" | "role" | "style"
> {
  className?: string;
  style?: CSSProperties;
}

export const Separator = (props: SeparatorProps): ReactElement => <BaseSeparator {...props} />;
