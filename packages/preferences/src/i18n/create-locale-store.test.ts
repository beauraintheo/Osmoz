import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vite-plus/test";

import { createLocaleStore } from "./create-locale-store.ts";
import type { LocaleStore } from "./create-locale-store.ts";

const fr = {
  app: { tagline: "Flexbox, en direct" },
  itemCount: (count: number): string => `${count} éléments`,
};

const en = {
  app: { tagline: "Flexbox, live" },
  itemCount: (count: number): string => `${count} items`,
} satisfies typeof fr;

interface Setup {
  key: string;
  store: LocaleStore<"fr" | "en", typeof fr>;
}

const persisted = (state: unknown): string => JSON.stringify({ state, version: 0 });

const setup = ({
  locales = ["fr", "en"],
  stored,
}: { locales?: readonly ("fr" | "en")[]; stored?: string } = {}): Setup => {
  const app = crypto.randomUUID();
  const key = `${app}:locale`;

  if (stored !== undefined) {
    localStorage.setItem(key, stored);
  }

  return { key, store: createLocaleStore({ app, catalogs: { en, fr }, fallback: "fr", locales }) };
};

const storageEvent = (key: string | null): void => {
  window.dispatchEvent(new StorageEvent("storage", { key }));
};

describe("createLocaleStore", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    document.documentElement.removeAttribute("lang");
  });

  it("lists the locales in the given order, not the catalogs' order", () => {
    expect(setup().store.getState().locales).toEqual(["fr", "en"]);
    expect(setup({ locales: ["en", "fr"] }).store.getState().locales).toEqual(["en", "fr"]);
  });

  it("uses the fallback when nothing is stored, whatever the browser's language", () => {
    vi.spyOn(navigator, "languages", "get").mockReturnValue(["en-US"]);

    const { store } = setup();

    expect(store.getState()).toMatchObject({ locale: "fr", messages: fr });
    expect(document.documentElement.lang).toBe("fr");
  });

  it("uses the stored locale", () => {
    const { store } = setup({ stored: persisted({ locale: "en" }) });

    expect(store.getState()).toMatchObject({ locale: "en", messages: en });
    expect(document.documentElement.lang).toBe("en");
  });

  it.each([
    ["a locale without catalog", persisted({ locale: "toString" })],
    ["a locale that is not a string", persisted({ locale: 1 })],
    ["a state without locale", persisted({ theme: "dark" })],
    ["a state that is not an object", persisted("en")],
    ["an empty state", persisted(null)],
    ["a value that is not JSON", "en"],
  ])("uses the fallback when the storage holds %s", (_case, stored) => {
    expect(setup({ stored }).store.getState().locale).toBe("fr");
  });

  it("stores and applies a new locale", () => {
    const { key, store } = setup();
    const listener = vi.fn();
    store.subscribe(listener);

    store.getState().setLocale("en");

    expect(localStorage.getItem(key)).toBe(persisted({ locale: "en" }));
    expect(store.getState().messages.itemCount(2)).toBe("2 items");
    expect(document.documentElement.lang).toBe("en");
    expect(listener).toHaveBeenCalledOnce();
  });

  it("keeps the same state when the locale does not change", () => {
    const { store } = setup();
    const listener = vi.fn();
    store.subscribe(listener);
    const before = store.getState();

    store.getState().setLocale("fr");

    expect(store.getState()).toBe(before);
    expect(listener).not.toHaveBeenCalled();
  });

  it("picks up a choice made in another tab", () => {
    const { key, store } = setup();

    localStorage.setItem(key, persisted({ locale: "en" }));
    storageEvent(key);

    expect(store.getState().locale).toBe("en");
    expect(document.documentElement.lang).toBe("en");
  });

  it("goes back to the fallback when another tab clears the storage", () => {
    const { store } = setup({ stored: persisted({ locale: "en" }) });

    localStorage.clear();
    storageEvent(null);

    expect(store.getState().locale).toBe("fr");
  });

  it("ignores storage changes of other keys", () => {
    const { store } = setup();
    const listener = vi.fn();
    store.subscribe(listener);

    storageEvent("other:locale");

    expect(listener).not.toHaveBeenCalled();
  });

  it("is a hook that re-renders the components reading the part that changes", () => {
    const { store } = setup();
    const { result } = renderHook(() => store((state) => state.messages.app.tagline));

    act(() => {
      store.getState().setLocale("en");
    });

    expect(result.current).toBe("Flexbox, live");
  });

  it("keeps working, silently, when the storage is unavailable", () => {
    vi.spyOn(window, "localStorage", "get").mockImplementation(() => {
      throw new DOMException("denied", "SecurityError");
    });
    const warn = vi.spyOn(console, "warn");
    const { store } = setup();

    store.getState().setLocale("en");

    expect(store.getState().locale).toBe("en");
    expect(warn).not.toHaveBeenCalled();
  });

  it("picks up a choice made in another tab once the storage is available again", () => {
    const blocked = vi.spyOn(window, "localStorage", "get").mockImplementation(() => {
      throw new DOMException("denied", "SecurityError");
    });
    const { key, store } = setup();

    blocked.mockRestore();
    localStorage.setItem(key, persisted({ locale: "en" }));
    storageEvent(key);

    expect(store.getState().locale).toBe("en");
  });
});
