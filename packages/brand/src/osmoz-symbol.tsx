import { useId } from "react";
import type { ComponentProps, ReactElement } from "react";

const CLOUD =
  "M42 51 A60 60 0 0 1 16 51 A10 10 0 0 1 14 31.2 A15 15 0 0 1 42 29 A11 11 0 0 1 42 51 Z";

export const OsmozSymbol = (props: ComponentProps<"svg">): ReactElement => {
  const gapId = `osmoz-gap-${useId().replace(/[^\w-]/g, "")}`;
  const labelled = props["aria-label"] !== undefined || props["aria-labelledby"] !== undefined;

  return (
    <svg
      viewBox="3.5 17.85 53 37.1"
      role={labelled ? "img" : undefined}
      aria-hidden={labelled ? undefined : true}
      focusable="false"
      {...props}
    >
      <mask id={gapId} maskUnits="userSpaceOnUse" x="0" y="0" width="80" height="70">
        <rect width="80" height="70" fill="white" />
        <path d={CLOUD} fill="none" stroke="black" strokeWidth="10" strokeLinejoin="round" />
      </mask>

      <circle
        cx="45"
        cy="30"
        r="11.5"
        mask={`url(#${gapId})`}
        style={{ fill: "var(--osmoz-o, currentColor)" }}
      />

      <path
        d={CLOUD}
        fill="none"
        strokeWidth="5"
        strokeLinejoin="round"
        style={{ stroke: "var(--osmoz-cloud, currentColor)" }}
      />
    </svg>
  );
};
