import { useId } from "react";
import type { ComponentProps, ReactElement } from "react";

const CLOUD =
  "M42 51 A60 60 0 0 1 16 51 A10 10 0 0 1 14 31.2 A15 15 0 0 1 42 29 A11 11 0 0 1 42 51 Z";

export const OsmozSymbol = (props: ComponentProps<"svg">): ReactElement => {
  const gapId = `osmoz-gap-${useId().replace(/[^\w-]/g, "")}`;
  const labelled = props["aria-label"] !== undefined || props["aria-labelledby"] !== undefined;

  return (
    <svg
      aria-hidden={labelled ? undefined : true}
      focusable="false"
      role={labelled ? "img" : undefined}
      viewBox="3.5 17.85 53 37.1"
      {...props}
    >
      <mask height="70" id={gapId} maskUnits="userSpaceOnUse" width="80" x="0" y="0">
        <rect fill="white" height="70" width="80" />
        <path d={CLOUD} fill="none" stroke="black" strokeLinejoin="round" strokeWidth="10" />
      </mask>

      <circle
        cx="45"
        cy="30"
        mask={`url(#${gapId})`}
        r="11.5"
        style={{ fill: "var(--osmoz-o, currentColor)" }}
      />

      <path
        d={CLOUD}
        fill="none"
        strokeLinejoin="round"
        strokeWidth="5"
        style={{ stroke: "var(--osmoz-cloud, currentColor)" }}
      />
    </svg>
  );
};
