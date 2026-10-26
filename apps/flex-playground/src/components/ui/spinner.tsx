import { Spinner as BaseSpinner } from "@osmoz/ui/spinner";
import { RiLoader4Line } from "@remixicon/react";
import type { ComponentProps, ReactElement } from "react";

import { cn } from "@/lib/cn";

export const Spinner = ({
  className,
  label,
  ...props
}: Omit<ComponentProps<typeof BaseSpinner>, "icon">): ReactElement => (
  <BaseSpinner
    {...props}
    className={cn("inline-flex items-center", className)}
    icon={<RiLoader4Line className="motion-safe:animate-spin" />}
    label={label === undefined ? undefined : <span className="sr-only">{label}</span>}
  />
);
