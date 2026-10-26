import { describe, expect, it } from "vite-plus/test";

import { cn } from "./cn.ts";

describe("cn", () => {
  it("joins the classes it is given", () => {
    expect(cn("rounded-md", "bg-primary")).toBe("rounded-md bg-primary");
  });

  it("skips empty and falsy values", () => {
    expect(cn("rounded-md", false, null, undefined, "", "px-3")).toBe("rounded-md px-3");
  });
});
