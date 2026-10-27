import { Spinner as BaseSpinner } from "@osmoz/ui/spinner";
import { RiLoader4Line } from "@remixicon/react";
import type { ComponentProps, ReactElement } from "react";

import { cn } from "@/lib/cn";

import { Icon } from "./icon";
import type { IconSize } from "./icon";

interface SpinnerProps extends Omit<ComponentProps<typeof BaseSpinner>, "icon"> {
  size?: IconSize;
}

export const Spinner = ({
  className,
  label,
  size = "default",
  ...props
}: SpinnerProps): ReactElement => (
  <BaseSpinner
    {...props}
    className={cn("inline-flex items-center", className)}
    icon={
      <Icon
        className="group-aria-busy/button:inline motion-safe:animate-spin"
        icon={RiLoader4Line}
        size={size}
      />
    }
    label={label === undefined ? undefined : <span className="sr-only">{label}</span>}
  />
);
