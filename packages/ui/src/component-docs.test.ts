import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vite-plus/test";

const SOURCE = import.meta.dirname;

const DOC_FILES = ["stories.tsx", "mdx"] as const;

const components = readdirSync(SOURCE, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

describe.each(components)("%s", (component) => {
  it.each(DOC_FILES)(`has its ${component}.%s`, (extension) => {
    expect(existsSync(join(SOURCE, component, `${component}.${extension}`))).toBe(true);
  });
});
