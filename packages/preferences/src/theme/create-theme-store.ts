import { create } from "zustand";
import type { StoreApi, UseBoundStore } from "zustand";
import { persist } from "zustand/middleware";

import { followOtherTabs } from "../persist/follow-other-tabs.ts";
import { persistPreference } from "../persist/persist-preference.ts";
import { themeStorageKey } from "./theme-options.ts";
import type { ThemeOptions } from "./theme-options.ts";

type ThemePreference<Theme extends string> = Theme | "system";

interface ThemeState<Theme extends string> {
  preference: ThemePreference<Theme>;
  resolved: Theme;
  themes: readonly Theme[];
  setPreference: (preference: ThemePreference<Theme>) => void;
}

export type ThemeStore<Theme extends string> = UseBoundStore<StoreApi<ThemeState<Theme>>>;

const SYSTEM_DARK_QUERY = "(prefers-color-scheme: dark)";

export const createThemeStore = <Theme extends string>({
  app,
  themes,
  system,
}: ThemeOptions<Theme>): ThemeStore<Theme> => {
  const key = themeStorageKey(app);
  const media = matchMedia(SYSTEM_DARK_QUERY);

  const isTheme = (value: string | null): value is Theme => themes.some((theme) => theme === value);

  const select = (
    preference: ThemePreference<Theme>,
  ): Pick<ThemeState<Theme>, "preference" | "resolved"> => {
    const systemTheme = media.matches ? system.dark : system.light;

    return { preference, resolved: preference === "system" ? systemTheme : preference };
  };

  const store = create<ThemeState<Theme>>()(
    persist(
      (set, get) => {
        const commit = (preference: ThemePreference<Theme>): void => {
          const next = select(preference);
          const current = get();

          if (next.preference !== current.preference || next.resolved !== current.resolved) {
            set(next);
          }
        };

        media.addEventListener("change", () => {
          commit(get().preference);
        });

        return { ...select("system"), themes, setPreference: commit };
      },
      persistPreference({
        name: key,
        field: "preference",
        restore: (stored) => select(isTheme(stored) ? stored : "system"),
      }),
    ),
  );

  const applyTheme = ({ resolved }: ThemeState<Theme>): void => {
    document.documentElement.dataset.theme = resolved;
  };

  applyTheme(store.getState());
  store.subscribe(applyTheme);

  followOtherTabs(store, key);

  return store;
};
