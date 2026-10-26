import { emptyMessages } from "@osmoz/preferences/i18n/empty-messages";
import { describe, expect, it } from "vite-plus/test";

import { en } from "./en";

describe("en", () => {
  it("writes every message", () => {
    expect(emptyMessages(en)).toEqual([]);
  });
});
