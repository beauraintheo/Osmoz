import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it, onTestFinished } from "vite-plus/test";

import { APPS_DIR, listApps } from "./list-apps.ts";

const makeAppsDir = (apps: readonly string[]): string => {
  const dir = mkdtempSync(join(tmpdir(), "osmoz-apps-"));
  onTestFinished(() => rmSync(dir, { force: true, recursive: true }));
  apps.map((name) => {
    mkdirSync(join(dir, name));
    writeFileSync(join(dir, name, "package.json"), "{}");
    return name;
  });
  return dir;
};

describe("listApps", () => {
  it("lists the folders holding a package.json, sorted", () => {
    expect(listApps(makeAppsDir(["tierlist", "flex"]))).toEqual(["flex", "tierlist"]);
  });

  it("ignores folders without a package.json and plain files", () => {
    const dir = makeAppsDir(["flex"]);
    mkdirSync(join(dir, "empty"));
    writeFileSync(join(dir, "notes.md"), "");

    expect(listApps(dir)).toEqual(["flex"]);
  });

  it("points APPS_DIR to the apps folder at the repo root", () => {
    expect(APPS_DIR).toBe(join(import.meta.dirname, "..", "..", "..", "apps"));
  });

  it("returns no app when the folder does not exist", () => {
    expect(listApps(join(makeAppsDir([]), "missing"))).toEqual([]);
  });
});
