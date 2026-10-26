import { describe, expect, it, vi } from "vite-plus/test";

import { THEME_OPTIONS } from "./theme-options";
import { useThemeStore } from "./use-theme-store";

vi.mock("@osmoz/preferences/theme/create-theme-store", () => ({
  createThemeStore: (options: unknown): unknown => ({ createdFrom: options }),
}));

describe("useThemeStore", () => {
  it("is created from the app's theme options", () => {
    expect(useThemeStore).toEqual({ createdFrom: THEME_OPTIONS });
  });
});
