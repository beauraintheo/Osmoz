import { describe, expect, it } from "vite-plus/test";

import { emptyMessages } from "./empty-messages.ts";

describe("emptyMessages", () => {
  it("finds nothing in a written catalog", () => {
    expect(
      emptyMessages({
        title: "Flux",
        header: { tagline: "Flexbox, live" },
        itemCount: (count: number): string => `${count} items`,
      }),
    ).toEqual([]);
  });

  it("gives the path of every empty or blank message, nested ones included", () => {
    expect(
      emptyMessages({
        title: "",
        header: { tagline: "  ", signature: "by Osmoz", menu: { close: "" } },
      }),
    ).toEqual(["title", "header.tagline", "header.menu.close"]);
  });
});
