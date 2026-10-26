import type { ComponentProps, ReactElement, ReactNode } from "react";

interface SpinnerProps extends Omit<ComponentProps<"span">, "children" | "role"> {
  icon: ReactElement;
  label?: ReactNode;
}

export const Spinner = ({ icon, label, ...props }: SpinnerProps): ReactElement =>
  label === undefined ? (
    <span {...props} aria-hidden="true">
      {icon}
    </span>
  ) : (
    <span {...props} role="status">
      <span aria-hidden="true">{icon}</span>
      {label}
    </span>
  );
