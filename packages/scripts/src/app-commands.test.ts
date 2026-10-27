import { describe, expect, it } from "vite-plus/test";

import { appCommands } from "./app-commands.ts";

const line = (action: Parameters<typeof appCommands>[0], app?: string): string[] =>
  appCommands(action, app).map(({ args, command }) => [command, ...args].join(" "));

describe("appCommands", () => {
  it("runs every workspace in dev without an app", () => {
    expect(line("dev")).toEqual(["vp run -F !osmoz dev"]);
  });

  it("runs one app in dev", () => {
    expect(line("dev", "flex")).toEqual(["vp run -F @osmoz/flex dev"]);
  });

  it("validates the whole monorepo and its stories without an app", () => {
    expect(line("validate")).toEqual([
      "vp check",
      "tsc --noEmit",
      "vp run -F !osmoz validate",
      "tsc --noEmit -p .storybook",
      "vp run -F osmoz test:stories",
    ]);
  });

  it("validates an app, the workspace packages it depends on, and the stories", () => {
    expect(line("validate", "flex")).toEqual([
      "vp check",
      "vp run -F @osmoz/flex... validate",
      "tsc --noEmit -p .storybook",
      "vp run -F osmoz test:stories",
    ]);
  });

  it("validates without the stories before building everything", () => {
    expect(line("build")).toEqual([
      "vp check",
      "tsc --noEmit",
      "vp run -F !osmoz validate",
      "vp run -F !osmoz build",
    ]);
  });

  it("validates an app without the stories before building it", () => {
    expect(line("build", "flex")).toEqual([
      "vp check",
      "vp run -F @osmoz/flex... validate",
      "vp run -F @osmoz/flex build",
    ]);
  });
});
