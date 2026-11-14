import { OsmozSignature } from "@osmoz/brand/osmoz-signature";
import { RiArrowGoBackLine, RiArrowGoForwardLine, RiQuestionLine } from "@remixicon/react";
import type { ReactElement } from "react";

import { LangToggle } from "@/components/preferences/lang-toggle";
import { ThemeToggle } from "@/components/preferences/theme-toggle";
import { Heading } from "@/components/ui/heading";
import { IconButton } from "@/components/ui/icon-button";
import { Separator } from "@/components/ui/separator";
import { Stack } from "@/components/ui/stack";
import { Text } from "@/components/ui/text";
import { useMessages } from "@/i18n/use-messages";

export const Header = (): ReactElement => {
  const messages = useMessages();

  return (
    <header className="flex h-14 items-center gap-3 border-b border-border bg-card py-2 pr-3 pl-5">
      <Stack align="baseline" direction="row" gap={2}>
        <Heading level={1}>{messages.app.name}</Heading>
        <Text as="span" className="hidden lg:inline" tone="muted" variant="control">
          {messages.app.tagline}
        </Text>
      </Stack>

      <Stack className="ml-auto" direction="row" gap={1}>
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
      </Stack>

      <Stack className="max-lg:hidden" direction="row" gap={1}>
        <LangToggle />
        <ThemeToggle />
      </Stack>

      <IconButton icon={RiQuestionLine} label={messages.header.help} variant="ghost" />

      <Separator aria-hidden className="max-lg:hidden" length="inset" orientation="vertical" />

      <OsmozSignature label={messages.signature.label} newTabLabel={messages.link.newTab} />
    </header>
  );
};
