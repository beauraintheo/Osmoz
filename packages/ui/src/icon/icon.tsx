import type { ComponentProps, ComponentType, ReactElement } from "react";

type SvgProps = Omit<ComponentProps<"svg">, "children">;

interface IconProps extends Omit<SvgProps, "aria-hidden" | "aria-label" | "role"> {
  icon: ComponentType<SvgProps>;
  label?: string;
}

export const Icon = ({ icon: Svg, label, ...props }: IconProps): ReactElement =>
  label === undefined ? (
    <Svg {...props} aria-hidden />
  ) : (
    <Svg {...props} aria-label={label} role="img" />
  );
