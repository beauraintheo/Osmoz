import { RiGlobalLine } from "@remixicon/react";
import type { ReactElement } from "react";

import { useLocaleStore } from "@/i18n/use-locale-store";
import { useMessages } from "@/i18n/use-messages";

import { Button } from "./ui/button";
import { Icon } from "./ui/icon";

export const LangToggle = (): ReactElement | null => {
  const { language } = useMessages();

  const locale = useLocaleStore((state) => state.locale);
  const locales = useLocaleStore((state) => state.locales);
  const setLocale = useLocaleStore((state) => state.setLocale);
  const target = locales.find((code) => code !== locale);

  if (target === undefined) {
    return null;
  }

  return (
    <Button
      aria-label={language.switchTo[target]}
      className="max-lg:hidden"
      onClick={() => setLocale(target)}
      variant="ghost"
    >
      <Icon icon={RiGlobalLine} />
      {language.short[target]}
    </Button>
  );
};
