import { RiMoonLine, RiSunLine } from "@remixicon/react";
import type { ReactElement } from "react";

import { useMessages } from "@/i18n/use-messages";
import { useThemeStore } from "@/theme/use-theme-store";

import { IconButton } from "./ui/icon-button";

export const ThemeToggle = (): ReactElement => {
  const messages = useMessages();

  const resolved = useThemeStore((state) => state.resolved);
  const setPreference = useThemeStore((state) => state.setPreference);
  const target = resolved === "light" ? "dark" : "light";

  return (
    <IconButton
      className="max-lg:hidden"
      icon={target === "dark" ? RiMoonLine : RiSunLine}
      label={messages.theme.switchTo[target]}
      onClick={() => setPreference(target)}
      variant="ghost"
    />
  );
};
