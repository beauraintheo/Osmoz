import { Link } from "@osmoz/ui/link";
import type { ReactElement } from "react";

import { OsmozSymbol } from "./osmoz-symbol.tsx";

const OSMOZ_URL = "https://github.com/beauraintheo";

interface OsmozSignatureProps {
  label: string;
  newTabLabel: string;
  className?: string;
}

export const OsmozSignature = ({
  label,
  newTabLabel,
  className,
}: OsmozSignatureProps): ReactElement => (
  <Link
    href={OSMOZ_URL}
    target="_blank"
    newTabHint={<span className="sr-only"> {newTabLabel}</span>}
    className={[
      "inline-flex h-8 min-w-8 items-center justify-center gap-2 rounded-md px-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
      className,
    ]
      .filter(Boolean)
      .join(" ")}
  >
    <OsmozSymbol className="h-4 w-auto" />
    <span className="sr-only lg:not-sr-only">{label}</span>
  </Link>
);
