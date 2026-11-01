import { afterEach, describe, expect, it } from "vite-plus/test";

import { useThemeStore } from "./use-theme-store";

describe("useThemeStore", () => {
  afterEach(() => {
    useThemeStore.getState().setPreference("system");
  });

  it("offers the light and dark themes", () => {
    expect(useThemeStore.getState().themes).toEqual(["light", "dark"]);
  });

  it("keeps the choice where the toolbar and the preview both read it", () => {
    useThemeStore.getState().setPreference("dark");

    expect(useThemeStore.getState().resolved).toBe("dark");
    expect(localStorage.getItem("osmoz-storybook:theme")).toContain("dark");
  });

  it("follows a choice made in the toolbar's window", () => {
    localStorage.setItem(
      "osmoz-storybook:theme",
      JSON.stringify({ state: { preference: "dark" }, version: 0 }),
    );
    window.dispatchEvent(new StorageEvent("storage", { key: "osmoz-storybook:theme" }));

    expect(useThemeStore.getState()).toMatchObject({ preference: "dark", resolved: "dark" });
  });
});
