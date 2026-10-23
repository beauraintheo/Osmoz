import { runInThisContext } from "node:vm";

import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";

import { firstPaintScript } from "./first-paint-script.ts";

const options = { app: "demo", system: { light: "paper", dark: "ink" } };

const stubSystemScheme = (scheme: "light" | "dark"): void => {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({ matches: scheme === "dark" && query.includes("dark") })),
  );
};

const run = (script: string): void => {
  runInThisContext(script);
};

describe("firstPaintScript", () => {
  beforeEach(() => {
    stubSystemScheme("light");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("applies the light system theme when nothing is stored", () => {
    run(firstPaintScript(options));

    expect(document.documentElement.dataset.theme).toBe("paper");
  });

  it("applies the dark system theme when the system prefers dark", () => {
    stubSystemScheme("dark");

    run(firstPaintScript(options));

    expect(document.documentElement.dataset.theme).toBe("ink");
  });

  it("applies the stored theme of the app", () => {
    localStorage.setItem("demo:theme", "ink");
    localStorage.setItem("other:theme", "paper");

    run(firstPaintScript(options));

    expect(document.documentElement.dataset.theme).toBe("ink");
  });

  it("follows the system when the stored preference is system", () => {
    localStorage.setItem("demo:theme", "system");
    stubSystemScheme("dark");

    run(firstPaintScript(options));

    expect(document.documentElement.dataset.theme).toBe("ink");
  });

  it("follows the system without throwing when the storage is unavailable", () => {
    localStorage.setItem("demo:theme", "paper");
    vi.stubGlobal("localStorage", {
      getItem: (): never => {
        throw new DOMException("denied", "SecurityError");
      },
    });
    stubSystemScheme("dark");

    expect(() => {
      run(firstPaintScript(options));
    }).not.toThrow();
    expect(document.documentElement.dataset.theme).toBe("ink");
  });

  it("cannot close the script element it is injected into", () => {
    const script = firstPaintScript({ ...options, app: "</script><script>alert(1)//" });

    expect(script).not.toContain("</");
  });
});
