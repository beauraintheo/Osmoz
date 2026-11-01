import { emptyMessages } from "@osmoz/preferences/i18n/empty-messages";
import { describe, expect, it } from "vite-plus/test";

import { PAGE_MESSAGES } from "./page-messages";

describe("PAGE_MESSAGES", () => {
  it("leaves no message empty", () => {
    expect(emptyMessages(PAGE_MESSAGES)).toEqual([]);
  });

  it("names the app and the component in the introduction", () => {
    expect(PAGE_MESSAGES.intro.look("Flux", "Button")).toBe("Flux's look for the Osmoz Button.");
    expect(PAGE_MESSAGES.intro.uiPage("Button")).toBe("Osmoz/Button");
  });

  it("names the app in the props section", () => {
    expect(PAGE_MESSAGES.addedProps.title("Flux")).toBe("Props added by Flux");
    expect(PAGE_MESSAGES.addedProps.none("Flux", "Separator")).toBe(
      "Flux adds no prop: every prop comes from the Osmoz Separator.",
    );
  });
});
