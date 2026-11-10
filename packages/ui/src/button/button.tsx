import { Button as BaseButton } from "@base-ui/react/button";
import type { ComponentProps, CSSProperties, ReactElement } from "react";

interface ButtonProps extends Omit<
  ComponentProps<typeof BaseButton>,
  "aria-busy" | "aria-disabled" | "className" | "nativeButton" | "render" | "style"
> {
  className?: string;
  pending?: boolean;
  style?: CSSProperties;
}

export const Button = ({
  disabled,
  focusableWhenDisabled,
  pending,
  type = "button",
  ...props
}: ButtonProps): ReactElement => (
  <BaseButton
    {...props}
    aria-busy={pending === true ? true : undefined}
    disabled={disabled === true || pending === true}
    focusableWhenDisabled={focusableWhenDisabled === true || pending === true}
    type={type}
  />
);
