import { act, renderHook } from "@testing-library/react";
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
  key: string;
  scheme: SystemScheme;
  store: ThemeStore<"paper" | "ink">;
}

const persisted = (state: unknown): string => JSON.stringify({ state, version: 0 });

const setup = ({ dark = false, stored }: { dark?: boolean; stored?: string } = {}): Setup => {
  const app = crypto.randomUUID();
  const key = themeStorageKey(app);
  const scheme = new SystemScheme(dark);

  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => scheme),
  );

  if (stored !== undefined) {
    localStorage.setItem(key, persisted({ preference: stored }));
  }

  const store = createThemeStore({
    app,
    system: { dark: "ink", light: "paper" },
    themes: ["paper", "ink"],
  });

  return { key, scheme, store };
};

const appliedTheme = (): string | undefined => document.documentElement.dataset.theme;

const failStorage = (): { mockRestore: () => void } =>
  vi.spyOn(window, "localStorage", "get").mockImplementation(() => {
    throw new DOMException("denied", "SecurityError");
  });

const storageEvent = (key: string | null): void => {
  window.dispatchEvent(new StorageEvent("storage", { key }));
};

describe("createThemeStore", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("exposes the themes of the app", () => {
    expect(setup().store.getState().themes).toEqual(["paper", "ink"]);
  });

  it("follows the system when nothing is stored", () => {
    const { store } = setup({ dark: true });

    expect(store.getState()).toMatchObject({ preference: "system", resolved: "ink" });
    expect(appliedTheme()).toBe("ink");
  });

  it("applies the stored theme", () => {
    const { store } = setup({ dark: true, stored: "paper" });

    expect(store.getState()).toMatchObject({ preference: "paper", resolved: "paper" });
    expect(appliedTheme()).toBe("paper");
  });

  it("follows the system when the stored value is not a theme of the app", () => {
    const { store } = setup({ dark: true, stored: "neon" });

    expect(store.getState()).toMatchObject({ preference: "system", resolved: "ink" });
    expect(appliedTheme()).toBe("ink");
  });

  it.each([
    ["a preference that is not a string", persisted({ preference: 1 })],
    ["a state without preference", persisted({ locale: "fr" })],
    ["a state that is not an object", persisted("ink")],
    ["an empty state", persisted(null)],
    ["a value that is not JSON", "ink"],
  ])("follows the system when the storage holds %s", (_case, value) => {
    const app = crypto.randomUUID();
    localStorage.setItem(themeStorageKey(app), value);
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => new SystemScheme(true)),
    );

    const store = createThemeStore({
      app,
      system: { dark: "ink", light: "paper" },
      themes: ["paper", "ink"],
    });

    expect(store.getState()).toMatchObject({ preference: "system", resolved: "ink" });
  });

  it("follows a system change during the session", () => {
    const { scheme, store } = setup();
    const listener = vi.fn();
    store.subscribe(listener);

    scheme.change(true);

    expect(store.getState().resolved).toBe("ink");
    expect(appliedTheme()).toBe("ink");
    expect(listener).toHaveBeenCalledOnce();
  });

  it("keeps a manual choice when the system changes", () => {
    const { scheme, store } = setup({ stored: "paper" });
    const listener = vi.fn();
    store.subscribe(listener);

    scheme.change(true);

    expect(store.getState().resolved).toBe("paper");
    expect(listener).not.toHaveBeenCalled();
  });

  it("stores, applies and announces a manual choice", () => {
    const { key, store } = setup();
    const listener = vi.fn();
    store.subscribe(listener);

    store.getState().setPreference("ink");

    expect(localStorage.getItem(key)).toBe(persisted({ preference: "ink" }));
    expect(store.getState()).toMatchObject({ preference: "ink", resolved: "ink" });
    expect(appliedTheme()).toBe("ink");
    expect(listener).toHaveBeenCalledOnce();
  });

  it("remembers going back to the system", () => {
    const { key, store } = setup({ stored: "ink" });

    store.getState().setPreference("system");

    expect(localStorage.getItem(key)).toBe(persisted({ preference: "system" }));
    expect(store.getState()).toMatchObject({ preference: "system", resolved: "paper" });
  });

  it("keeps the same state while nothing changes", () => {
    const { store } = setup();
    const listener = vi.fn();
    store.subscribe(listener);
    const before = store.getState();

    store.getState().setPreference("system");

    expect(store.getState()).toBe(before);
    expect(listener).not.toHaveBeenCalled();
  });

  it("stops announcing changes once unsubscribed", () => {
    const { store } = setup();
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);

    unsubscribe();
    store.getState().setPreference("ink");

    expect(listener).not.toHaveBeenCalled();
  });

  it("picks up a choice made in another tab", () => {
    const { key, store } = setup();

    localStorage.setItem(key, persisted({ preference: "ink" }));
    storageEvent(key);

    expect(store.getState()).toMatchObject({ preference: "ink", resolved: "ink" });
    expect(appliedTheme()).toBe("ink");
  });

  it("follows the system when another tab clears the storage", () => {
    const { store } = setup({ stored: "ink" });

    localStorage.clear();
    storageEvent(null);

    expect(store.getState().preference).toBe("system");
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

    expect(store.getState()).toMatchObject({ preference: "system", resolved: "ink" });
  });

  it("keeps a manual choice for the session, silently, when the storage is unavailable", () => {
    failStorage();
    const warn = vi.spyOn(console, "warn");
    const { store } = setup();

    expect(() => {
      store.getState().setPreference("ink");
    }).not.toThrow();
    expect(store.getState().resolved).toBe("ink");

    expect(() => {
      store.getState().setPreference("system");
    }).not.toThrow();
    expect(store.getState().resolved).toBe("paper");
    expect(warn).not.toHaveBeenCalled();
  });

  it("picks up a choice made in another tab once the storage is available again", () => {
    const blocked = failStorage();
    const { key, store } = setup();

    blocked.mockRestore();
    localStorage.setItem(key, persisted({ preference: "ink" }));
    storageEvent(key);

    expect(store.getState().resolved).toBe("ink");
  });

  it("is a hook that re-renders the components reading the part that changes", () => {
    const { store } = setup();
    const { result } = renderHook(() => store((state) => state.resolved));

    act(() => {
      store.getState().setPreference("ink");
    });

    expect(result.current).toBe("ink");
  });
});
