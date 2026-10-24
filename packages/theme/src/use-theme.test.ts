import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vite-plus/test";

import { createThemeStore } from "./create-theme-store.ts";
import type { ThemeStore } from "./create-theme-store.ts";
import { useTheme } from "./use-theme.ts";

const createStore = (): ThemeStore<"paper" | "ink"> => {
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => Object.assign(new EventTarget(), { matches: false })),
  );

  return createThemeStore({
    app: crypto.randomUUID(),
    themes: ["paper", "ink"],
    system: { light: "paper", dark: "ink" },
  });
};

describe("useTheme", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("returns the state and the themes of the store", () => {
    const store = createStore();
    const { result } = renderHook(() => useTheme(store));

    expect(result.current).toMatchObject({
      preference: "system",
      resolved: "paper",
      themes: ["paper", "ink"],
    });
  });

  it("re-renders when the preference changes", () => {
    const store = createStore();
    const { result } = renderHook(() => useTheme(store));

    act(() => {
      result.current.setPreference("ink");
    });

    expect(result.current).toMatchObject({ preference: "ink", resolved: "ink" });
  });

  it("re-renders when the store changes from outside the component", () => {
    const store = createStore();
    const { result } = renderHook(() => useTheme(store));

    act(() => {
      store.setPreference("ink");
    });

    expect(result.current.resolved).toBe("ink");
  });
});
