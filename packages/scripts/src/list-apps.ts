import { existsSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";

export const APPS_DIR = resolve(import.meta.dirname, "../../../apps");

export const listApps = (appsDir: string): string[] =>
  existsSync(appsDir)
    ? readdirSync(appsDir, { withFileTypes: true })
        .filter(
          (entry) => entry.isDirectory() && existsSync(join(appsDir, entry.name, "package.json")),
        )
        .map((entry) => entry.name)
        .toSorted()
    : [];
