import type { ComponentProps, ReactElement } from "react";

import { resolveButtonBehavior, resolveButtonClick } from "./button-behavior.ts";

interface ButtonProps extends Omit<ComponentProps<"button">, "aria-busy" | "aria-disabled"> {
  focusableWhenDisabled?: boolean;
  pending?: boolean;
}

export const Button = ({
  disabled,
  focusableWhenDisabled,
  onClick,
  pending,
  type = "button",
  ...props
}: ButtonProps): ReactElement => {
  const behavior = resolveButtonBehavior({
    disabled,
    focusableWhenDisabled,
    pending,
  });

  return (
    <button
      {...props}
      aria-busy={pending === true ? true : undefined}
      aria-disabled={behavior.inert || undefined}
      disabled={behavior.disabled}
      onClick={resolveButtonClick(behavior.inert, onClick)}
      type={type}
    />
  );
};
