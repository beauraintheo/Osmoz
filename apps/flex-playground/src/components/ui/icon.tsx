import { Icon as BaseIcon } from "@osmoz/ui/icon";
import type { ComponentProps, ReactElement } from "react";

import { cn } from "@/lib/cn";

const SIZE_CLASSES = {
  default: "size-4 pointer-coarse:size-5",
  sm: "size-4",
} as const;

export type IconSize = keyof typeof SIZE_CLASSES;

interface IconProps extends ComponentProps<typeof BaseIcon> {
  size?: IconSize;
}

export const Icon = ({ className, size = "default", ...props }: IconProps): ReactElement => (
  <BaseIcon
    {...props}
    className={cn("shrink-0 group-aria-busy/button:hidden", SIZE_CLASSES[size], className)}
  />
);
