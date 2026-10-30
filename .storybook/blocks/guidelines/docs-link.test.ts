import { describe, expect, it } from "vite-plus/test";

import { componentName, docsPath, isPlainClick } from "./docs-link";
import type { Click } from "./docs-link";

const PLAIN: Click = {
  altKey: false,
  button: 0,
  ctrlKey: false,
  metaKey: false,
  shiftKey: false,
};

describe("docsPath", () => {
  it("points to a component's doc page in Storybook's interface", () => {
    expect(docsPath("ui-link")).toBe("?path=/docs/ui-link--docs");
  });
});

describe("componentName", () => {
  it("keeps the last segment of a story title", () => {
    expect(componentName("UI/IconButton")).toBe("IconButton");
  });

  it("keeps a title without a section as is", () => {
    expect(componentName("Link")).toBe("Link");
  });
});

describe("isPlainClick", () => {
  it("accepts a main-button click without a modifier", () => {
    expect(isPlainClick(PLAIN)).toBe(true);
  });

  it("leaves a middle click to the browser", () => {
    expect(isPlainClick({ ...PLAIN, button: 1 })).toBe(false);
  });

  it("leaves a click with a modifier to the browser", () => {
    expect(
      [
        { ...PLAIN, altKey: true },
        { ...PLAIN, ctrlKey: true },
        { ...PLAIN, metaKey: true },
        { ...PLAIN, shiftKey: true },
      ].map(isPlainClick),
    ).toEqual([false, false, false, false]);
  });
});
