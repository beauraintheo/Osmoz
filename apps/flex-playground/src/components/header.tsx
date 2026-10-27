import { OsmozSignature } from "@osmoz/brand/osmoz-signature";
import { RiArrowGoBackLine, RiArrowGoForwardLine, RiQuestionLine } from "@remixicon/react";
import type { ReactElement } from "react";

import { useMessages } from "@/i18n/use-messages";

import { LangToggle } from "./lang-toggle";
import { ThemeToggle } from "./theme-toggle";
import { IconButton } from "./ui/icon-button";
import { Separator } from "./ui/separator";

export const Header = (): ReactElement => {
  const messages = useMessages();

  return (
    <header className="flex h-14 items-center gap-3 border-b border-border bg-card py-2 pr-3 pl-5">
      <div className="flex items-baseline gap-2">
        <h1 className="font-mono text-title">{messages.app.name}</h1>
        <span className="hidden text-control text-muted-foreground lg:inline">
          {messages.app.tagline}
        </span>
      </div>

      <div className="ml-auto flex gap-1">
        <IconButton
          disabled
          icon={RiArrowGoBackLine}
          label={messages.header.undo}
          variant="ghost"
        />
        <IconButton
          disabled
          icon={RiArrowGoForwardLine}
          label={messages.header.redo}
          variant="ghost"
        />
      </div>

      <div className="flex gap-1 max-lg:hidden">
        <LangToggle />
        <ThemeToggle />
      </div>

      <IconButton icon={RiQuestionLine} label={messages.header.help} variant="ghost" />

      <Separator className="h-5 self-center max-lg:hidden" decorative orientation="vertical" />

      <OsmozSignature label={messages.signature.label} newTabLabel={messages.link.newTab} />
    </header>
  );
};
