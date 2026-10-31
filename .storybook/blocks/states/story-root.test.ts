import { describe, expect, it } from "vite-plus/test";

import { storyRoot } from "./story-root";

const container = (html: string): HTMLDivElement => {
  const element = document.createElement("div");

  element.innerHTML = html;

  return element;
};

describe("storyRoot", () => {
  it("reads the element a story renders without an app theme", () => {
    expect(storyRoot(container("<button></button>"))?.tagName).toBe("BUTTON");
  });

  it("reads the element inside an app's theme wrapper, past its style", () => {
    const rendered = container('<div data-app-theme=""><style></style><button></button></div>');

    expect(storyRoot(rendered)?.tagName).toBe("BUTTON");
  });

  it("reads the element inside a story's layout wrapper", () => {
    const rendered = container('<div data-story-layout=""><hr></div>');

    expect(storyRoot(rendered)?.tagName).toBe("HR");
  });

  it("reads the element inside a layout wrapper inside an app's theme wrapper", () => {
    const rendered = container(
      '<div data-app-theme=""><style></style><div data-story-layout=""><hr></div></div>',
    );

    expect(storyRoot(rendered)?.tagName).toBe("HR");
  });

  it("reads nothing from a story that has not rendered yet", () => {
    expect(storyRoot(container(""))).toBeNull();
  });

  it("reads nothing from an app's theme wrapper that holds only its style", () => {
    expect(storyRoot(container('<div data-app-theme=""><style></style></div>'))).toBeNull();
  });
});
