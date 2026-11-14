import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vite-plus/test";

import introduction from "./introduction.mdx?raw";
import { TYPOGRAPHY_CLASSES } from "./typography-classes.ts";

const theme = readFileSync(join(import.meta.dirname, "../../theme/theme.css"), "utf8");

const ROLES = Object.entries(TYPOGRAPHY_CLASSES);

const byName = (a: string, b: string): number => a.localeCompare(b);

const rolesOf = (source: string, pattern: RegExp): string[] =>
  [...source.matchAll(pattern)].flatMap(([, role]) => (role === undefined ? [] : [role]));

const MONO_ROLES = rolesOf(introduction, /<Token name="text-([a-z]+)">[^<]*`font-mono`/g);

describe("TYPOGRAPHY_CLASSES", () => {
  it.each(ROLES)("gives %s its own size class", (role, classes) => {
    expect(classes.split(" ")).toContain(`text-${role}`);
  });

  it.each(ROLES)("sets the font family of %s as the Flux introduction says", (role, classes) => {
    expect(classes).toContain(MONO_ROLES.includes(role) ? "font-mono" : "font-sans");
  });

  it("covers every typography role of the theme", () => {
    const themeRoles = rolesOf(theme, /--text-([a-z]+):/g);

    expect(Object.keys(TYPOGRAPHY_CLASSES).toSorted(byName)).toEqual(themeRoles.toSorted(byName));
  });
});
