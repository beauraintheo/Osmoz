import { describe, expect, it } from "vite-plus/test";

import { functionName, showInSnippet } from "./snippet-props";

describe("showInSnippet", () => {
  it("shows a prop the story sets", () => {
    expect(showInSnippet("Save", "children")).toBe(true);
  });

  it("hides a prop left undefined", () => {
    expect(showInSnippet(undefined, "label")).toBe(false);
  });

  it("hides an event handler, a spy of the tests", () => {
    expect(showInSnippet(() => undefined, "onClick")).toBe(false);
  });

  it("shows a component passed as a prop", () => {
    expect(showInSnippet(() => undefined, "icon")).toBe(true);
  });

  it("shows a prop whose name only starts with on", () => {
    expect(showInSnippet(true, "once")).toBe(true);
  });
});

describe("functionName", () => {
  it("names a component passed as a prop, as the code would", () => {
    const RiSaveLine = (): null => null;

    expect(functionName(RiSaveLine)).toBe("RiSaveLine");
  });

  it("hides a name the bundler shortened, which the code never shows", () => {
    const Qx = (): null => null;

    expect(functionName(Qx)).toBe("…");
  });

  it("hides a value that is not a function", () => {
    expect(functionName("RiSaveLine")).toBe("…");
  });
});
