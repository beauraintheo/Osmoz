import { describe, expect, it, vi } from "vite-plus/test";

import { en } from "./en";
import { useMessages } from "./use-messages";

vi.mock("./use-locale-store", () => ({
  useLocaleStore: (selector: (state: { messages: typeof en }) => unknown): unknown =>
    selector({ messages: en }),
}));

describe("useMessages", () => {
  it("reads the catalog of the current language from the language store", () => {
    expect(useMessages()).toBe(en);
  });
});
