import type { ComponentProps, ReactElement } from "react";

const HEADING_TAGS = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
  5: "h5",
  6: "h6",
} as const;

export type HeadingLevel = keyof typeof HEADING_TAGS;

interface HeadingProps extends ComponentProps<"h1"> {
  level: HeadingLevel;
}

export const Heading = ({ level, ...props }: HeadingProps): ReactElement => {
  const Tag = HEADING_TAGS[level];

  return <Tag {...props} />;
};
