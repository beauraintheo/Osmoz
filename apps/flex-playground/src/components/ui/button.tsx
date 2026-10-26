import { Button as BaseButton } from "@osmoz/ui/button";
import type { ComponentProps, ReactElement } from "react";

import { cn } from "@/lib/cn";

import { Spinner } from "./spinner";

export const BUTTON_CLASSES =
  "inline-flex cursor-pointer items-center justify-center border text-control font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-45 aria-disabled:cursor-not-allowed aria-disabled:opacity-45 aria-busy:cursor-progress";

export const BUTTON_VARIANT_CLASSES = {
  ghost: "border-transparent bg-transparent enabled:hover:bg-muted",
  primary: "border-primary bg-primary text-primary-foreground enabled:hover:bg-accent-foreground",
  secondary: "border-input bg-card enabled:hover:bg-muted",
} as const;

const SIZE_CLASSES = {
  default:
    "h-8 gap-2 rounded-md px-3 pointer-coarse:h-11 pointer-coarse:rounded-lg pointer-coarse:px-4",
  sm: "h-6 gap-1 rounded-md px-1 pointer-coarse:h-9 pointer-coarse:px-3",
} as const;

const ICON_SIZE_CLASSES = {
  default: "**:size-4 pointer-coarse:**:size-5",
  sm: "**:size-4",
} as const;

interface ButtonProps extends ComponentProps<typeof BaseButton> {
  icon?: ReactElement;
  size?: keyof typeof SIZE_CLASSES;
  variant?: keyof typeof BUTTON_VARIANT_CLASSES;
}

export const Button = ({
  children,
  className,
  icon,
  pending,
  size = "default",
  variant = "secondary",
  ...props
}: ButtonProps): ReactElement => {
  const visual = pending ? <Spinner /> : icon;

  return (
    <BaseButton
      {...props}
      className={cn(BUTTON_CLASSES, SIZE_CLASSES[size], BUTTON_VARIANT_CLASSES[variant], className)}
      pending={pending}
    >
      {visual ? (
        <span aria-hidden="true" className={cn("inline-flex shrink-0", ICON_SIZE_CLASSES[size])}>
          {visual}
        </span>
      ) : null}
      {children}
    </BaseButton>
  );
};
