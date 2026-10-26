import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import { create } from "zustand";
import type { StoreApi } from "zustand";
import { persist } from "zustand/middleware";

import { persistPreference } from "./persist-preference.ts";

interface State {
  locale: string;
  other: number;
}

const FALLBACK = "fr";

const persisted = (state: unknown): string => JSON.stringify({ state, version: 0 });

const restore = (stored: string | null): Partial<State> => ({
  locale: stored === "en" ? stored : FALLBACK,
});

interface Setup {
  store: Pick<StoreApi<State>, "getState" | "setState" | "subscribe"> & {
    persist: { rehydrate: () => Promise<void> | void };
  };
  name: string;
}

const setup = ({ stored }: { stored?: string } = {}): Setup => {
  const name = `${crypto.randomUUID()}:locale`;

  if (stored !== undefined) {
    localStorage.setItem(name, stored);
  }

  const store = create<State>()(
    persist(
      () => ({ locale: FALLBACK, other: 1 }),
      persistPreference({ name, field: "locale", restore }),
    ),
  );

  return { store, name };
};

describe("persistPreference", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it("restores the stored value", () => {
    const { store } = setup({ stored: persisted({ locale: "en" }) });

    expect(store.getState()).toEqual({ locale: "en", other: 1 });
  });

  it.each([
    ["nothing", undefined],
    ["a value the store rejects", persisted({ locale: "de" })],
    ["a value that is not a string", persisted({ locale: 1 })],
    ["a value it does not own", JSON.stringify({ state: { ["__proto__"]: { locale: "en" } } })],
    ["a state without the field", persisted({ theme: "dark" })],
    ["a state that is not an object", persisted("en")],
    ["an empty state", persisted(null)],
    ["a value that is not JSON", "en"],
  ])("restores from null when the storage holds %s", (_case, stored) => {
    expect(setup({ stored }).store.getState().locale).toBe(FALLBACK);
  });

  it("stores only its field", () => {
    const { store, name } = setup();

    store.setState({ locale: "en", other: 2 });

    expect(localStorage.getItem(name)).toBe(persisted({ locale: "en" }));
  });

  it("notifies nobody when it reloads the value it already holds", async () => {
    const { store } = setup({ stored: persisted({ locale: "en" }) });
    const before = store.getState();
    const listener = vi.fn();
    store.subscribe(listener);

    await store.persist.rehydrate();

    expect(store.getState()).toBe(before);
    expect(listener).not.toHaveBeenCalled();
  });

  it("notifies when it reloads a new value", async () => {
    const { store, name } = setup();
    const listener = vi.fn();
    store.subscribe(listener);

    localStorage.setItem(name, persisted({ locale: "en" }));
    await store.persist.rehydrate();

    expect(store.getState()).toEqual({ locale: "en", other: 1 });
    expect(listener).toHaveBeenCalledOnce();
  });

  it("keeps working, silently, when the storage is unavailable", () => {
    vi.spyOn(window, "localStorage", "get").mockImplementation(() => {
      throw new DOMException("denied", "SecurityError");
    });
    const warn = vi.spyOn(console, "warn");
    const { store } = setup();

    store.setState({ locale: "en" });

    expect(store.getState().locale).toBe("en");
    expect(warn).not.toHaveBeenCalled();
  });
});
