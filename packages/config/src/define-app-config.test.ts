import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { describe, expect, it, vi } from "vite-plus/test";

import { defineAppConfig } from "./define-app-config.ts";
import { testConfig } from "./test-config.ts";

vi.mock("@tanstack/router-plugin/vite", { spy: true });

const root = "/workspace/apps/demo";

const pluginNames = (plugins: unknown[]): string[] =>
  plugins
    .flat(Infinity)
    .flatMap((plugin) =>
      typeof plugin === "object" &&
      plugin !== null &&
      "name" in plugin &&
      typeof plugin.name === "string"
        ? [plugin.name]
        : [],
    );

describe("defineAppConfig", () => {
  it("maps the @ alias to the app's src folder", () => {
    expect(defineAppConfig({ root }).resolve?.alias).toEqual({ "@": `${root}/src` });
  });

  it("registers the router, React, React Compiler and Tailwind plugins", () => {
    const names = pluginNames(defineAppConfig({ root }).plugins ?? []);

    expect(names).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/tanstack:router/),
        expect.stringMatching(/vite:react/),
        expect.stringMatching(/babel/),
        expect.stringMatching(/@tailwindcss\/vite/),
      ]),
    );
  });

  it("puts the router plugin before the React plugin", () => {
    const names = pluginNames(defineAppConfig({ root }).plugins ?? []);
    const routerIndex = names.findIndex((name) => name.includes("tanstack:router"));
    const reactIndex = names.findIndex((name) => name.includes("vite:react"));

    expect(routerIndex).toBeGreaterThanOrEqual(0);
    expect(routerIndex).toBeLessThan(reactIndex);
  });

  it("names index routes home.tsx, so no route file is an index.tsx", () => {
    defineAppConfig({ root });

    expect(tanstackRouter).toHaveBeenCalledWith(expect.objectContaining({ indexToken: "home" }));
  });

  it("uses the shared test config", () => {
    expect(defineAppConfig({ root }).test).toBe(testConfig);
  });
});
