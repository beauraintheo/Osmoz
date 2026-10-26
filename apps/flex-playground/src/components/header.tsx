import { OsmozSignature } from "@osmoz/brand/osmoz-signature";
import type { ReactElement } from "react";

import { useLocaleStore } from "@/i18n/use-locale-store";

import { LangToggle } from "./lang-toggle";

export const Header = (): ReactElement => {
  const messages = useLocaleStore((state) => state.messages);

  return (
    <header className="flex h-14 items-center gap-3 border-b border-border bg-card py-2 pr-3 pl-5">
      <div className="flex items-baseline gap-2">
        <h1 className="font-mono text-title">{messages.app.name}</h1>
        <span className="hidden text-control text-muted-foreground lg:inline">
          {messages.app.tagline}
        </span>
      </div>

      <LangToggle />

      <OsmozSignature
        className="ml-auto"
        label={messages.signature.label}
        newTabLabel={messages.link.newTab}
      />
    </header>
  );
};
