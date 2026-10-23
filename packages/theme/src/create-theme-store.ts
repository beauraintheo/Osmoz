import { themeStorageKey } from "./theme-options.ts";
import type { ThemeOptions } from "./theme-options.ts";

export type ThemePreference<Theme extends string> = Theme | "system";

export interface ThemeState<Theme extends string> {
  preference: ThemePreference<Theme>;
  resolved: Theme;
}

export interface ThemeStore<Theme extends string> {
  themes: readonly Theme[];
  getSnapshot: () => ThemeState<Theme>;
  subscribe: (listener: () => void) => () => void;
  setPreference: (preference: ThemePreference<Theme>) => void;
}

const SYSTEM_DARK_QUERY = "(prefers-color-scheme: dark)";

const readStorage = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const writeStorage = (key: string, preference: string): void => {
  try {
    if (preference === "system") {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, preference);
    }
  } catch {
    return;
  }
};

export const createThemeStore = <Theme extends string>({
  app,
  themes,
  system,
}: ThemeOptions<Theme>): ThemeStore<Theme> => {
  const key = themeStorageKey(app);
  const media = matchMedia(SYSTEM_DARK_QUERY);
  const changes = new EventTarget();

  const isTheme = (value: string | null): value is Theme => themes.some((theme) => theme === value);

  const readPreference = (): ThemePreference<Theme> => {
    const stored = readStorage(key);

    return isTheme(stored) ? stored : "system";
  };

  const toState = (preference: ThemePreference<Theme>): ThemeState<Theme> => {
    const systemTheme = media.matches ? system.dark : system.light;

    return { preference, resolved: preference === "system" ? systemTheme : preference };
  };

  let state = toState(readPreference());

  const apply = (): void => {
    document.documentElement.dataset.theme = state.resolved;
  };

  const commit = (preference: ThemePreference<Theme>): void => {
    const next = toState(preference);

    if (next.preference === state.preference && next.resolved === state.resolved) {
      return;
    }

    state = next;
    apply();
    changes.dispatchEvent(new Event("change"));
  };

  apply();

  media.addEventListener("change", () => {
    commit(state.preference);
  });

  window.addEventListener("storage", (event) => {
    if (event.key === key || event.key === null) {
      commit(readPreference());
    }
  });

  return {
    themes,
    getSnapshot: () => state,
    subscribe: (listener) => {
      changes.addEventListener("change", listener);

      return () => {
        changes.removeEventListener("change", listener);
      };
    },
    setPreference: (preference) => {
      writeStorage(key, preference);
      commit(preference);
    },
  };
};
