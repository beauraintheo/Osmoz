import { IconButton as BaseIconButton } from "@osmoz/ui/icon-button";
import type { ComponentProps, ReactElement } from "react";

import { cn } from "@/lib/cn";

import { BUTTON_CLASSES, BUTTON_VARIANT_CLASSES } from "./button";
import { Spinner } from "./spinner";

const SIZE_CLASSES = {
  default:
    "size-8 rounded-md **:size-4 pointer-coarse:size-11 pointer-coarse:rounded-lg pointer-coarse:**:size-5",
  sm: "size-6 rounded-md **:size-4 pointer-coarse:size-9",
} as const;

interface IconButtonProps extends ComponentProps<typeof BaseIconButton> {
  size?: keyof typeof SIZE_CLASSES;
  variant?: keyof typeof BUTTON_VARIANT_CLASSES;
}

export const IconButton = ({
  className,
  icon,
  pending,
  size = "default",
  variant = "ghost",
  ...props
}: IconButtonProps): ReactElement => (
  <BaseIconButton
    {...props}
    className={cn(BUTTON_CLASSES, SIZE_CLASSES[size], BUTTON_VARIANT_CLASSES[variant], className)}
    icon={pending ? <Spinner /> : icon}
    pending={pending}
  />
);
