import { emptyMessages } from "@osmoz/preferences/i18n/empty-messages";
import { describe, expect, it } from "vite-plus/test";

import { ATTRIBUTES_MESSAGES } from "./attributes-messages";

describe("ATTRIBUTES_MESSAGES", () => {
  it("leaves no message empty", () => {
    expect(emptyMessages(ATTRIBUTES_MESSAGES)).toEqual([]);
  });

  it("quotes a value as in HTML", () => {
    expect(ATTRIBUTES_MESSAGES.value("true")).toBe('"true"');
  });
});
