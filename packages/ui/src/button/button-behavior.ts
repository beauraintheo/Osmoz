import type { MouseEventHandler } from "react";

interface ButtonState {
  disabled: boolean | undefined;
  focusableWhenDisabled: boolean | undefined;
  pending: boolean | undefined;
}

interface ButtonBehavior {
  disabled: true | undefined;
  inert: boolean;
}

export const resolveButtonBehavior = ({
  disabled,
  focusableWhenDisabled,
  pending,
}: ButtonState): ButtonBehavior => {
  const focusable = focusableWhenDisabled === true || pending === true;

  return {
    disabled: disabled === true && !focusable ? true : undefined,
    inert: pending === true || (disabled === true && focusable),
  };
};

export const preventClick = (event: {
  preventDefault: () => void;
  stopPropagation: () => void;
}): void => {
  event.preventDefault();
  event.stopPropagation();
};

export const resolveButtonClick = (
  inert: boolean,
  onClick: MouseEventHandler<HTMLButtonElement> | undefined,
): MouseEventHandler<HTMLButtonElement> | undefined => (inert ? preventClick : onClick);
