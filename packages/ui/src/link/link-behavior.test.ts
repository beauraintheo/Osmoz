import { describe, expect, it } from "vite-plus/test";

import { resolveLinkBehavior } from "./link-behavior.ts";

describe("resolveLinkBehavior", () => {
  it("leaves a link without href untouched", () => {
    expect(resolveLinkBehavior({})).toEqual({ rel: undefined, external: false, newTab: false });
  });

  it.each(["/legal", "#help", "mailto:hello@osmoz.dev"])(
    "does not treat %s as external",
    (href) => {
      expect(resolveLinkBehavior({ href }).external).toBe(false);
    },
  );

  it.each(["https://github.com/beauraintheo", "//cdn.osmoz.dev"])(
    "treats %s as external",
    (href) => {
      expect(resolveLinkBehavior({ href }).external).toBe(true);
    },
  );

  it("adds noopener when the link opens a new tab", () => {
    expect(resolveLinkBehavior({ href: "https://osmoz.dev", target: "_blank" })).toEqual({
      rel: "noopener",
      external: true,
      newTab: true,
    });
  });

  it("treats a named target as a new tab", () => {
    expect(resolveLinkBehavior({ href: "https://osmoz.dev", target: "preview" })).toEqual({
      rel: "noopener",
      external: true,
      newTab: true,
    });
  });

  it.each(["_self", "_parent", "_top", "_SELF", "_Top", ""])(
    "does not treat target %j as a new tab",
    (target) => {
      expect(resolveLinkBehavior({ href: "/legal", target })).toEqual({
        rel: undefined,
        external: false,
        newTab: false,
      });
    },
  );

  it("keeps the caller's rel on a same-tab link", () => {
    expect(resolveLinkBehavior({ href: "https://osmoz.dev", rel: "me" }).rel).toBe("me");
  });

  it("keeps the caller's casing without repeating noopener", () => {
    expect(resolveLinkBehavior({ target: "_blank", rel: "Me NoOpener me" }).rel).toBe(
      "Me NoOpener",
    );
  });

  it("keeps the caller's rel without repeating noopener", () => {
    expect(resolveLinkBehavior({ target: "_blank", rel: "me  noopener" }).rel).toBe("me noopener");
  });
});
