import { RiGlobalLine } from "@remixicon/react";
import type { ReactElement } from "react";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { useLocaleStore } from "@/i18n/use-locale-store";
import { useMessages } from "@/i18n/use-messages";

export const LangToggle = (): ReactElement | null => {
  const messages = useMessages();

  const locale = useLocaleStore((state) => state.locale);
  const locales = useLocaleStore((state) => state.locales);
  const setLocale = useLocaleStore((state) => state.setLocale);
  const target = locales.find((code) => code !== locale);

  if (target === undefined) {
    return null;
  }

  return (
    <Button
      aria-label={messages.language.switchTo[target]}
      onClick={() => setLocale(target)}
      variant="ghost"
    >
      <Icon icon={RiGlobalLine} />
      {messages.language.short[target]}
    </Button>
  );
};
