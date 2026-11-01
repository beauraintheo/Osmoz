import { describe, expect, it } from "vite-plus/test";

import { formatAttribute, readAttributes, sameAttributes, storyRoot } from "./read-attributes";

const container = (html: string): HTMLDivElement => {
  const element = document.createElement("div");

  element.innerHTML = html;

  return element;
};

const button = (): HTMLButtonElement => {
  const element = document.createElement("button");

  element.setAttribute("type", "button");
  element.setAttribute("class", "native");
  element.setAttribute("style", "color: red");
  element.setAttribute("disabled", "");
  element.setAttribute("aria-busy", "true");

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

describe("readAttributes", () => {
  it("reads every attribute but class and style, sorted by name", () => {
    expect(readAttributes(button())).toEqual([
      { name: "aria-busy", value: "true" },
      { name: "disabled", value: "" },
      { name: "type", value: "button" },
    ]);
  });

  it("reads nothing from an element without attributes", () => {
    expect(readAttributes(document.createElement("span"))).toEqual([]);
  });
});

describe("sameAttributes", () => {
  it("matches two readings of an unchanged element", () => {
    expect(sameAttributes(readAttributes(button()), readAttributes(button()))).toBe(true);
  });

  it("tells apart a changed value", () => {
    expect(
      sameAttributes(
        [{ name: "aria-busy", value: "true" }],
        [{ name: "aria-busy", value: "false" }],
      ),
    ).toBe(false);
  });

  it("tells apart an added attribute", () => {
    expect(sameAttributes([], [{ name: "disabled", value: "" }])).toBe(false);
  });
});

describe("formatAttribute", () => {
  it("writes a valued attribute as in HTML", () => {
    expect(formatAttribute({ name: "type", value: "button" })).toBe('type="button"');
  });

  it("writes a boolean attribute by its name alone", () => {
    expect(formatAttribute({ name: "disabled", value: "" })).toBe("disabled");
  });
});
