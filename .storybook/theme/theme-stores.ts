import { createThemeStore } from "@osmoz/preferences/theme/create-theme-store";
import { defineThemeOptions } from "@osmoz/preferences/theme/theme-options";

import { THEME_OPTIONS as OSMOZ_CSS_THEME_OPTIONS } from "../../apps/osmoz-css/src/theme/theme-options";

const STORAGE_APP = "osmoz-storybook";

export const THEME_STORES = {
  osmoz: createThemeStore(
    defineThemeOptions({
      app: STORAGE_APP,
      system: { dark: "dark", light: "light" },
      themes: ["light", "dark"],
    }),
  ),
  "osmoz-css": createThemeStore({
    ...OSMOZ_CSS_THEME_OPTIONS,
    app: `${STORAGE_APP}:osmoz-css`,
  }),
};

export type Section = keyof typeof THEME_STORES;

export const isSection = (value: unknown): value is Section =>
  typeof value === "string" && Object.hasOwn(THEME_STORES, value);

export const sectionOf = (app: unknown): Section => (isSection(app) ? app : "osmoz");

export const sectionOfEntry = (id: string | null): Section =>
  Object.keys(THEME_STORES)
    .filter(isSection)
    .filter((section) => id?.startsWith(`${section}-`) === true)
    .reduce<Section>(
      (longest, section) => (section.length > longest.length ? section : longest),
      "osmoz",
    );
