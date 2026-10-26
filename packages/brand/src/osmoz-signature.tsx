import { Link } from "@osmoz/ui/link";
import type { ReactElement } from "react";

import { OsmozSymbol } from "./osmoz-symbol.tsx";

const OSMOZ_URL = "https://github.com/beauraintheo";

interface OsmozSignatureProps {
  className?: string;
  label: string;
  newTabLabel: string;
}

export const OsmozSignature = ({
  className,
  label,
  newTabLabel,
}: OsmozSignatureProps): ReactElement => (
  <Link
    className={[
      "inline-flex h-8 min-w-8 items-center pointer-coarse:h-11 pointer-coarse:min-w-11 justify-center gap-2 rounded-md px-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
      className,
    ]
      .filter(Boolean)
      .join(" ")}
    href={OSMOZ_URL}
    newTab
    newTabHint={<span className="sr-only"> {newTabLabel}</span>}
  >
    <OsmozSymbol className="h-4 w-auto" />
    <span className="sr-only lg:not-sr-only">{label}</span>
  </Link>
);
