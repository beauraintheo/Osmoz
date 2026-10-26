import { describe, expect, it } from "vite-plus/test";

import { emptyMessages } from "./empty-messages.ts";

describe("emptyMessages", () => {
  it("finds nothing in a written catalog", () => {
    expect(
      emptyMessages({
        header: { tagline: "Flexbox, live" },
        itemCount: (count: number): string => `${count} items`,
        title: "Flux",
      }),
    ).toEqual([]);
  });

  it("gives the path of every empty or blank message, nested ones included", () => {
    expect(
      emptyMessages({
        header: { menu: { close: "" }, signature: "by Osmoz", tagline: "  " },
        title: "",
      }),
    ).toEqual(["header.menu.close", "header.tagline", "title"]);
  });
});
