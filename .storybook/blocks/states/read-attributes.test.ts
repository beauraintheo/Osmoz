import { describe, expect, it } from "vite-plus/test";

import { formatAttribute, readAttributes, sameAttributes } from "./read-attributes";

const button = (): HTMLButtonElement => {
  const element = document.createElement("button");

  element.setAttribute("type", "button");
  element.setAttribute("class", "native");
  element.setAttribute("style", "color: red");
  element.setAttribute("disabled", "");
  element.setAttribute("aria-busy", "true");

  return element;
};

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
