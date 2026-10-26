import type { ComponentProps, ReactElement } from "react";

import { Button } from "../button/button.tsx";

interface IconButtonProps extends Omit<ComponentProps<typeof Button>, "aria-label" | "children"> {
  icon: ReactElement;
  label: string;
}

export const IconButton = ({ icon, label, ...props }: IconButtonProps): ReactElement => (
  <Button {...props} aria-label={label}>
    <span aria-hidden="true">{icon}</span>
  </Button>
);
