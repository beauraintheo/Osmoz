import { safeStorage } from "@osmoz/preferences/persist/safe-storage";

import { readThemeEvent } from "./theme-event";
import type { ThemeEvent } from "./theme-event";

const KEY = "osmoz-storybook:manager-theme";

export const saveThemeEvent = (event: ThemeEvent): void => {
  void safeStorage.setItem(KEY, JSON.stringify(event));
};

export const restoreThemeEvent = (): ThemeEvent | undefined => {
  const stored = safeStorage.getItem(KEY);

  if (typeof stored !== "string") {
    return undefined;
  }

  try {
    const payload: unknown = JSON.parse(stored);

    return readThemeEvent(payload);
  } catch {
    return undefined;
  }
};
