import { IconButton as BaseIconButton } from "@osmoz/ui/icon-button";
import type { ComponentProps, ReactElement } from "react";

import { cn } from "@/lib/cn";

import { BUTTON_CLASSES, BUTTON_VARIANT_CLASSES } from "./button";
import { Icon } from "./icon";
import { Spinner } from "./spinner";

const SIZE_CLASSES = {
  default: "size-8 rounded-md pointer-coarse:size-11 pointer-coarse:rounded-lg",
  sm: "size-6 rounded-md pointer-coarse:size-9",
} as const;

interface IconButtonProps extends Omit<ComponentProps<typeof BaseIconButton>, "icon"> {
  icon: ComponentProps<typeof Icon>["icon"];
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
    className={cn(
      BUTTON_CLASSES,
      "*:flex",
      SIZE_CLASSES[size],
      BUTTON_VARIANT_CLASSES[variant],
      className,
    )}
    icon={pending ? <Spinner size={size} /> : <Icon icon={icon} size={size} />}
    pending={pending}
  />
);
