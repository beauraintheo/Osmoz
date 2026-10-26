import { emptyMessages } from "@osmoz/preferences/i18n/empty-messages";
import { describe, expect, it } from "vite-plus/test";

import { fr } from "./fr";

describe("fr", () => {
  it("writes every message", () => {
    expect(emptyMessages(fr)).toEqual([]);
  });
});
