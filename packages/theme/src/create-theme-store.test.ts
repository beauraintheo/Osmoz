import { afterEach, describe, expect, it, vi } from "vite-plus/test";

import { createThemeStore } from "./create-theme-store.ts";
import type { ThemeStore } from "./create-theme-store.ts";
import { themeStorageKey } from "./theme-options.ts";

class SystemScheme extends EventTarget {
  matches: boolean;

  constructor(dark: boolean) {
    super();
    this.matches = dark;
  }

  change(dark: boolean): void {
    this.matches = dark;
    this.dispatchEvent(new Event("change"));
  }
}

interface Setup {
  store: ThemeStore<"paper" | "ink">;
  key: string;
  scheme: SystemScheme;
}

const setup = ({ dark = false, stored }: { dark?: boolean; stored?: string } = {}): Setup => {
  const app = crypto.randomUUID();
  const key = themeStorageKey(app);
  const scheme = new SystemScheme(dark);

  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => scheme),
  );

  if (stored !== undefined) {
    localStorage.setItem(key, stored);
  }

  const store = createThemeStore({
    app,
    themes: ["paper", "ink"],
    system: { light: "paper", dark: "ink" },
  });

  return { store, key, scheme };
};

const appliedTheme = (): string | undefined => document.documentElement.dataset.theme;

const failStorage = (): void => {
  const fail = (): never => {
    throw new DOMException("denied", "SecurityError");
  };

  vi.stubGlobal("localStorage", { getItem: fail, setItem: fail, removeItem: fail });
};

const storageEvent = (key: string | null): void => {
  window.dispatchEvent(new StorageEvent("storage", { key }));
};

describe("createThemeStore", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("exposes the themes of the app", () => {
    expect(setup().store.themes).toEqual(["paper", "ink"]);
  });

  it("follows the system when nothing is stored", () => {
    const { store } = setup({ dark: true });

    expect(store.getSnapshot()).toEqual({ preference: "system", resolved: "ink" });
    expect(appliedTheme()).toBe("ink");
  });

  it("applies the stored theme", () => {
    const { store } = setup({ dark: true, stored: "paper" });

    expect(store.getSnapshot()).toEqual({ preference: "paper", resolved: "paper" });
    expect(appliedTheme()).toBe("paper");
  });

  it("follows the system when the stored value is not a theme of the app", () => {
    const { store } = setup({ dark: true, stored: "neon" });

    expect(store.getSnapshot()).toEqual({ preference: "system", resolved: "ink" });
    expect(appliedTheme()).toBe("ink");
  });

  it("follows a system change during the session", () => {
    const { store, scheme } = setup();
    const listener = vi.fn();
    store.subscribe(listener);

    scheme.change(true);

    expect(store.getSnapshot().resolved).toBe("ink");
    expect(appliedTheme()).toBe("ink");
    expect(listener).toHaveBeenCalledOnce();
  });

  it("keeps a manual choice when the system changes", () => {
    const { store, scheme } = setup({ stored: "paper" });
    const listener = vi.fn();
    store.subscribe(listener);

    scheme.change(true);

    expect(store.getSnapshot().resolved).toBe("paper");
    expect(listener).not.toHaveBeenCalled();
  });

  it("stores, applies and announces a manual choice", () => {
    const { store, key } = setup();
    const listener = vi.fn();
    store.subscribe(listener);

    store.setPreference("ink");

    expect(localStorage.getItem(key)).toBe("ink");
    expect(store.getSnapshot()).toEqual({ preference: "ink", resolved: "ink" });
    expect(appliedTheme()).toBe("ink");
    expect(listener).toHaveBeenCalledOnce();
  });

  it("clears the stored choice when going back to the system", () => {
    const { store, key } = setup({ stored: "ink" });

    store.setPreference("system");

    expect(localStorage.getItem(key)).toBeNull();
    expect(store.getSnapshot()).toEqual({ preference: "system", resolved: "paper" });
  });

  it("keeps the same snapshot while nothing changes", () => {
    const { store } = setup();
    const listener = vi.fn();
    store.subscribe(listener);
    const before = store.getSnapshot();

    store.setPreference("system");

    expect(store.getSnapshot()).toBe(before);
    expect(listener).not.toHaveBeenCalled();
  });

  it("stops announcing changes once unsubscribed", () => {
    const { store } = setup();
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);

    unsubscribe();
    store.setPreference("ink");

    expect(listener).not.toHaveBeenCalled();
  });

  it("picks up a choice made in another tab", () => {
    const { store, key } = setup();

    localStorage.setItem(key, "ink");
    storageEvent(key);

    expect(store.getSnapshot()).toEqual({ preference: "ink", resolved: "ink" });
    expect(appliedTheme()).toBe("ink");
  });

  it("follows the system when another tab clears the storage", () => {
    const { store } = setup({ stored: "ink" });

    localStorage.clear();
    storageEvent(null);

    expect(store.getSnapshot().preference).toBe("system");
  });

  it("ignores storage changes of other keys", () => {
    const { store } = setup();
    const listener = vi.fn();
    store.subscribe(listener);

    storageEvent("other:theme");

    expect(listener).not.toHaveBeenCalled();
  });

  it("follows the system without throwing when the storage is unavailable", () => {
    failStorage();

    const { store } = setup({ dark: true });

    expect(store.getSnapshot()).toEqual({ preference: "system", resolved: "ink" });
  });

  it("keeps a manual choice for the session when the storage is unavailable", () => {
    failStorage();
    const { store } = setup();

    expect(() => {
      store.setPreference("ink");
    }).not.toThrow();
    expect(store.getSnapshot().resolved).toBe("ink");

    expect(() => {
      store.setPreference("system");
    }).not.toThrow();
    expect(store.getSnapshot().resolved).toBe("paper");
  });
});
