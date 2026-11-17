import type { ComponentProps, ReactElement } from "react";

import { cn } from "@/lib/cn";

import { TYPOGRAPHY_CLASSES } from "./typography-classes";
import type { TypographyRole } from "./typography-classes";

const TONE_CLASSES = {
  default: "text-foreground",
  muted: "text-muted-foreground",
} as const;

interface TextProps extends ComponentProps<"p"> {
  as?: "p" | "span";
  tone?: keyof typeof TONE_CLASSES;
  variant?: Exclude<TypographyRole, "title">;
}

export const Text = ({
  as: Tag = "p",
  className,
  tone = "default",
  variant = "body",
  ...props
}: TextProps): ReactElement => (
  <Tag
    {...props}
    className={cn("wrap-break-word", TYPOGRAPHY_CLASSES[variant], TONE_CLASSES[tone], className)}
  />
);
