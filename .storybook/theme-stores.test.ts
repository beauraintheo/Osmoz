import { afterEach, describe, expect, it } from "vite-plus/test";

import { isSection, sectionOf, sectionOfEntry, THEME_STORES } from "./theme-stores";

describe("THEME_STORES", () => {
  afterEach(() => {
    THEME_STORES.flux.getState().setPreference("system");
    THEME_STORES.osmoz.getState().setPreference("system");
  });

  it("offers each section the themes of its app", () => {
    expect(THEME_STORES.flux.getState().themes).toEqual(["light", "dark"]);
    expect(THEME_STORES.osmoz.getState().themes).toEqual(["light", "dark"]);
  });

  it("keeps one choice per section", () => {
    THEME_STORES.flux.getState().setPreference("dark");

    expect(THEME_STORES.flux.getState().resolved).toBe("dark");
    expect(localStorage.getItem("osmoz-storybook:flux:theme")).toContain("dark");
    expect(THEME_STORES.osmoz.getState().preference).toBe("system");
  });

  it("follows a choice made in the toolbar's window", () => {
    localStorage.setItem(
      "osmoz-storybook:theme",
      JSON.stringify({ state: { preference: "dark" }, version: 0 }),
    );
    window.dispatchEvent(new StorageEvent("storage", { key: "osmoz-storybook:theme" }));

    expect(THEME_STORES.osmoz.getState()).toMatchObject({ preference: "dark", resolved: "dark" });
  });
});

describe("isSection", () => {
  it("accepts a section", () => {
    expect(isSection("flux")).toBe(true);
  });

  it("rejects anything else", () => {
    expect(isSection("unknown")).toBe(false);
    expect(isSection(undefined)).toBe(false);
  });
});

describe("sectionOf", () => {
  it("returns the section of an app", () => {
    expect(sectionOf("flux")).toBe("flux");
  });

  it("falls back to Osmoz without an app", () => {
    expect(sectionOf(undefined)).toBe("osmoz");
  });
});

describe("sectionOfEntry", () => {
  it("returns the section named by the entry's id", () => {
    expect(sectionOfEntry("flux-introduction--docs")).toBe("flux");
  });

  it("returns Osmoz for its components", () => {
    expect(sectionOfEntry("osmoz-button--docs")).toBe("osmoz");
  });

  it("falls back to Osmoz for an unknown section or without an id", () => {
    expect(sectionOfEntry("unknown-page--docs")).toBe("osmoz");
    expect(sectionOfEntry("fluxy-page--docs")).toBe("osmoz");
    expect(sectionOfEntry(null)).toBe("osmoz");
  });
});
