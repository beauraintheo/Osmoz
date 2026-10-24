import { useSyncExternalStore } from "react";

import type { ThemePreference, ThemeState, ThemeStore } from "./create-theme-store.ts";

export interface UseThemeResult<Theme extends string> extends ThemeState<Theme> {
  themes: readonly Theme[];
  setPreference: (preference: ThemePreference<Theme>) => void;
}

export const useTheme = <Theme extends string>(store: ThemeStore<Theme>): UseThemeResult<Theme> => {
  const state = useSyncExternalStore(store.subscribe, store.getSnapshot);

  return { ...state, themes: store.themes, setPreference: store.setPreference };
};
