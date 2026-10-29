import { describe, expect, it } from "vite-plus/test";

import { readToken } from "./read-token";

const themed = (tokens: Readonly<Record<string, string>>): HTMLElement => {
  const element = document.createElement("div");

  Object.entries(tokens).map(([name, value]) => element.style.setProperty(`--${name}`, value));

  return document.body.appendChild(element);
};

describe("readToken", () => {
  it("reads a color token as a color", () => {
    expect(readToken(themed({ primary: "oklch(0.5 0.15 294)" }), "primary")).toEqual({
      color: true,
      value: "oklch(0.5 0.15 294)",
    });
  });

  it("reads a token that is not a color without a swatch", () => {
    expect(readToken(themed({ "radius-md": "0.375rem" }), "radius-md")).toEqual({
      color: false,
      value: "0.375rem",
    });
  });

  it("resolves a token that aliases another one", () => {
    const element = themed({ card: "rgb(255, 0, 128)", popover: "var(--card)" });

    expect(readToken(element, "popover").value).toBe("rgb(255, 0, 128)");
  });

  it("reads an empty value from a token the theme does not define", () => {
    expect(readToken(themed({}), "missing")).toEqual({ color: false, value: "" });
  });
});
