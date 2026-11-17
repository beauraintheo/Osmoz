import { Button as BaseButton } from "@osmoz/ui/button";
import type { ComponentProps, ReactElement } from "react";

import { cn } from "@/lib/cn";

import { Spinner } from "./spinner";
import { TYPOGRAPHY_CLASSES } from "./typography-classes";

export const BUTTON_CLASSES = cn(
  TYPOGRAPHY_CLASSES.control,
  "inline-flex max-w-full cursor-pointer items-center justify-center border text-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-busy:cursor-progress data-disabled:opacity-45 data-disabled:not-aria-busy:cursor-not-allowed",
);

export const BUTTON_VARIANT_CLASSES = {
  ghost: "border-transparent bg-transparent not-data-disabled:hover:bg-muted",
  primary:
    "border-primary bg-primary text-primary-foreground not-data-disabled:hover:bg-accent-foreground",
  secondary: "border-input bg-card not-data-disabled:hover:bg-muted",
} as const;

const SIZE_CLASSES = {
  default:
    "min-h-8 gap-2 rounded-md px-3 py-1 pointer-coarse:min-h-11 pointer-coarse:rounded-lg pointer-coarse:px-4",
  sm: "min-h-6 gap-1 rounded-md px-1 pointer-coarse:min-h-9 pointer-coarse:px-3",
} as const;

interface ButtonProps extends ComponentProps<typeof BaseButton> {
  size?: keyof typeof SIZE_CLASSES;
  variant?: keyof typeof BUTTON_VARIANT_CLASSES;
}

export const Button = ({
  children,
  className,
  pending,
  size = "default",
  variant = "secondary",
  ...props
}: ButtonProps): ReactElement => (
  <BaseButton
    {...props}
    className={cn(
      BUTTON_CLASSES,
      "aria-busy:[&>svg]:hidden",
      SIZE_CLASSES[size],
      BUTTON_VARIANT_CLASSES[variant],
      className,
    )}
    pending={pending}
  >
    {pending ? <Spinner size={size} /> : null}
    {children}
  </BaseButton>
);
