import { RiGlobalLine } from "@remixicon/react";
import type { ReactElement } from "react";

import { useLocaleStore } from "@/i18n/use-locale-store";

import { Button } from "./ui/button";

export const LangToggle = (): ReactElement | null => {
  const locale = useLocaleStore((state) => state.locale);
  const locales = useLocaleStore((state) => state.locales);
  const setLocale = useLocaleStore((state) => state.setLocale);
  const language = useLocaleStore((state) => state.messages.language);
  const target = locales.find((code) => code !== locale);

  if (target === undefined) {
    return null;
  }

  return (
    <Button
      aria-label={language.switchTo[target]}
      className="max-lg:hidden"
      icon={<RiGlobalLine />}
      onClick={() => setLocale(target)}
      variant="ghost"
    >
      {language.short[target]}
    </Button>
  );
};
