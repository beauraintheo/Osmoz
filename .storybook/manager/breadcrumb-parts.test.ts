import { describe, expect, it } from "vite-plus/test";

import { breadcrumbParts } from "./breadcrumb-parts";

describe("breadcrumbParts", () => {
  it("splits a title into its section and the current page", () => {
    expect(breadcrumbParts("osmoz.css/Button")).toEqual({
      current: "Button",
      parents: ["osmoz.css"],
    });
  });

  it("keeps a title without section as the current page", () => {
    expect(breadcrumbParts("Button")).toEqual({ current: "Button", parents: [] });
  });
});
