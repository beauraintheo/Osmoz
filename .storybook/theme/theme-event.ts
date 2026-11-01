import { safeStorage } from "@osmoz/preferences/persist/safe-storage";
import { z } from "zod/mini";

import { isSection } from "./theme-stores";
import type { Section } from "./theme-stores";
import { themeTokensSchema } from "./theme-tokens";

export const THEME_EVENT = "osmoz/theme";

const KEY = "osmoz-storybook:manager-theme";

const themeEventSchema = z.object({
  brandTitle: z.string(),
  brandUrl: z.string(),
  section: z.custom<Section>(isSection),
  tokens: themeTokensSchema,
});

export type ThemeEvent = z.infer<typeof themeEventSchema>;

export const readThemeEvent = (payload: unknown): ThemeEvent | undefined => {
  const result = themeEventSchema.safeParse(payload);

  return result.success ? result.data : undefined;
};

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
