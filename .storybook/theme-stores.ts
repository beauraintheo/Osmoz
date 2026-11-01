import { createThemeStore } from "@osmoz/preferences/theme/create-theme-store";
import { defineThemeOptions } from "@osmoz/preferences/theme/theme-options";

import { THEME_OPTIONS as FLUX_THEME_OPTIONS } from "../apps/flex-playground/src/theme/theme-options";

const STORAGE_APP = "osmoz-storybook";

export const THEME_STORES = {
  flux: createThemeStore({ ...FLUX_THEME_OPTIONS, app: `${STORAGE_APP}:flux` }),
  osmoz: createThemeStore(
    defineThemeOptions({
      app: STORAGE_APP,
      system: { dark: "dark", light: "light" },
      themes: ["light", "dark"],
    }),
  ),
};

export type Section = keyof typeof THEME_STORES;

export const isSection = (value: unknown): value is Section =>
  typeof value === "string" && Object.hasOwn(THEME_STORES, value);

export const sectionOf = (app: unknown): Section => (isSection(app) ? app : "osmoz");

export const sectionOfEntry = (id: string | null): Section =>
  Object.keys(THEME_STORES)
    .filter(isSection)
    .find((section) => id?.startsWith(`${section}-`) === true) ?? "osmoz";
