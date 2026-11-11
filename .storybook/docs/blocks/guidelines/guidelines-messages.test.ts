import { emptyMessages } from "@osmoz/preferences/i18n/empty-messages";
import { describe, expect, it } from "vite-plus/test";

import { GUIDELINES_MESSAGES } from "./guidelines-messages";

describe("GUIDELINES_MESSAGES", () => {
  it("leaves no message empty", () => {
    expect(emptyMessages(GUIDELINES_MESSAGES)).toEqual([]);
  });
});
