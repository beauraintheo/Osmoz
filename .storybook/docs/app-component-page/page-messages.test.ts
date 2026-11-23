import { emptyMessages } from "@osmoz/preferences/i18n/empty-messages";
import { describe, expect, it } from "vite-plus/test";

import { PAGE_MESSAGES } from "./page-messages";

describe("PAGE_MESSAGES", () => {
  it("leaves no message empty", () => {
    expect(emptyMessages(PAGE_MESSAGES)).toEqual([]);
  });

  it("names the app and the component in the introduction", () => {
    expect(PAGE_MESSAGES.intro.look("osmoz.css", "Button")).toBe(
      "osmoz.css's look for the Osmoz Button.",
    );
    expect(PAGE_MESSAGES.intro.uiPage("Button")).toBe("Osmoz/Button");
  });

  it("names the app in the API section", () => {
    expect(PAGE_MESSAGES.api.addedProps("osmoz.css")).toBe("Props added by osmoz.css");
    expect(PAGE_MESSAGES.api.none("osmoz.css", "Separator")).toBe(
      "osmoz.css adds no prop: every prop comes from the Osmoz Separator.",
    );
  });
});
