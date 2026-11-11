import { emptyMessages } from "@osmoz/preferences/i18n/empty-messages";
import { describe, expect, it } from "vite-plus/test";

import { KEYBOARD_MESSAGES } from "./keyboard-messages";

describe("KEYBOARD_MESSAGES", () => {
  it("leaves no message empty", () => {
    expect(emptyMessages(KEYBOARD_MESSAGES)).toEqual([]);
  });
});
