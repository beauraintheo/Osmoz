import { describe, expect, it } from "vite-plus/test";

import { mdnUrl } from "./mdn-url";

describe("mdnUrl", () => {
  it("links a property to its MDN page", () => {
    expect(mdnUrl("flex-direction")).toBe(
      "https://developer.mozilla.org/docs/Web/CSS/flex-direction",
    );
  });
});
