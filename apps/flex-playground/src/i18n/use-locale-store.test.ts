import { describe, expect, it, vi } from "vite-plus/test";

import { en } from "./en";
import { fr } from "./fr";
import { useLocaleStore } from "./use-locale-store";

vi.mock("@osmoz/preferences/i18n/create-locale-store", () => ({
  createLocaleStore: (options: unknown): unknown => ({ createdFrom: options }),
}));

describe("useLocaleStore", () => {
  it("is created from the app's catalogs, French first and as the fallback", () => {
    expect(useLocaleStore).toEqual({
      createdFrom: { app: "flux", catalogs: { en, fr }, fallback: "fr", locales: ["fr", "en"] },
    });
  });
});
