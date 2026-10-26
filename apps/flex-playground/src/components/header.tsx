import { OsmozSignature } from "@osmoz/brand/osmoz-signature";
import type { ReactElement } from "react";

export const Header = (): ReactElement => (
  <header className="flex h-14 items-center gap-3 border-b border-border bg-card py-2 pr-3 pl-5">
    <div className="flex items-baseline gap-2.5">
      <h1 className="font-mono text-title">Flux</h1>
      <span className="hidden text-control text-muted-foreground lg:inline">
        Flexbox, en direct
      </span>
    </div>

    <OsmozSignature label="par Osmoz" newTabLabel="nouvel onglet" className="ml-auto" />
  </header>
);
