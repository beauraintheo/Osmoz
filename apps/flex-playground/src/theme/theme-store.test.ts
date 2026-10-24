import { describe, expect, it, vi } from "vite-plus/test";

import { THEME_OPTIONS } from "./theme-options";
import { themeStore } from "./theme-store";

vi.mock("@osmoz/theme/create-theme-store", () => ({
  createThemeStore: (options: unknown): unknown => ({ createdFrom: options }),
}));

describe("themeStore", () => {
  it("is created from the app's theme options", () => {
    expect(themeStore).toEqual({ createdFrom: THEME_OPTIONS });
  });
});
