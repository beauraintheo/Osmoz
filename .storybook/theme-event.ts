import { z } from "zod/mini";

import { isSection } from "./theme-stores";
import type { Section } from "./theme-stores";
import { themeTokensSchema } from "./theme-tokens";

export const THEME_EVENT = "osmoz/theme";

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
