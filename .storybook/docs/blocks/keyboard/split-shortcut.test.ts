import { describe, expect, it } from "vite-plus/test";

import { splitShortcut } from "./split-shortcut";

describe("splitShortcut", () => {
  it("keeps a single key as is", () => {
    expect(splitShortcut("Tab")).toEqual(["Tab"]);
  });

  it("splits a combination on its plus signs", () => {
    expect(splitShortcut("Ctrl+Shift+Tab")).toEqual(["Ctrl", "Shift", "Tab"]);
  });

  it("reads a lone plus sign as the plus key", () => {
    expect(splitShortcut("+")).toEqual(["+"]);
  });

  it("reads a trailing plus sign as the plus key of a combination", () => {
    expect(splitShortcut("Ctrl++")).toEqual(["Ctrl", "+"]);
  });

  it("reads no key from an empty shortcut", () => {
    expect(splitShortcut("")).toEqual([]);
  });
});
