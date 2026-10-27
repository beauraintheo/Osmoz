import type { ComponentProps, ComponentType, ReactElement } from "react";

type SvgProps = Pick<ComponentProps<"svg">, "aria-hidden" | "aria-label" | "className" | "role">;

interface IconProps {
  className?: string;
  icon: ComponentType<SvgProps>;
  label?: string;
}

export const Icon = ({ className, icon: Svg, label }: IconProps): ReactElement =>
  label === undefined ? (
    <Svg aria-hidden className={className} />
  ) : (
    <Svg aria-label={label} className={className} role="img" />
  );
