import { describe, expect, it } from "vite-plus/test";

import { brandTitle } from "./brand-title";

const parse = (html: string): HTMLElement => {
  const host = document.createElement("div");

  host.innerHTML = html;

  return host;
};

const OSMOZ = {
  mono: false,
  name: "Osmoz",
  tagline: "Design system",
} as const;

describe("brandTitle", () => {
  it("shows the Osmoz symbol, hidden from assistive technologies", () => {
    expect(parse(brandTitle(OSMOZ)).querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
  });

  it("names the design system", () => {
    expect(parse(brandTitle(OSMOZ)).textContent).toBe("OsmozDesign system");
  });

  it("sets the name in the monospace font when asked", () => {
    const name = (mono: boolean): Element | null =>
      parse(brandTitle({ ...OSMOZ, mono })).querySelector(".osmoz-brand-name");

    expect(name(true)?.classList.contains("osmoz-brand-name-mono")).toBe(true);
    expect(name(false)?.classList.contains("osmoz-brand-name-mono")).toBe(false);
  });

  it("escapes its texts", () => {
    expect(brandTitle({ ...OSMOZ, name: "<b>" })).toContain("&lt;b&gt;");
  });
});
