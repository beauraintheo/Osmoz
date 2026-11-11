import { describe, expect, it } from "vite-plus/test";

import { exposedAttributes, replaceReading } from "./exposed-attributes";
import type { StoryReading } from "./exposed-attributes";

const DEFAULT: StoryReading = {
  attributes: [
    { name: "aria-orientation", value: "horizontal" },
    { name: "role", value: "separator" },
    { name: "type", value: "button" },
  ],
  story: { id: "osmoz-separator--default", name: "Default" },
};

const VERTICAL: StoryReading = {
  attributes: [
    { name: "aria-orientation", value: "vertical" },
    { name: "data-orientation", value: "vertical" },
    { name: "role", value: "separator" },
  ],
  story: { id: "osmoz-separator--vertical", name: "Vertical" },
};

describe("exposedAttributes", () => {
  it("lists the role, aria-* and data-* attributes, sorted, with the stories of each value", () => {
    expect(exposedAttributes([DEFAULT, VERTICAL])).toEqual([
      {
        name: "aria-orientation",
        values: [
          { stories: [DEFAULT.story], value: "horizontal" },
          { stories: [VERTICAL.story], value: "vertical" },
        ],
      },
      { name: "data-orientation", values: [{ stories: [VERTICAL.story], value: "vertical" }] },
      {
        name: "role",
        values: [{ stories: [DEFAULT.story, VERTICAL.story], value: "separator" }],
      },
    ]);
  });

  it("lists nothing before any story is read", () => {
    expect(exposedAttributes([])).toEqual([]);
  });
});

describe("replaceReading", () => {
  it("adds the reading of a story read for the first time", () => {
    expect(replaceReading({ [DEFAULT.story.id]: DEFAULT }, VERTICAL)).toEqual({
      [DEFAULT.story.id]: DEFAULT,
      [VERTICAL.story.id]: VERTICAL,
    });
  });

  it("keeps the same readings when a story reads the same", () => {
    const readings = { [DEFAULT.story.id]: DEFAULT };

    expect(replaceReading(readings, { ...DEFAULT, attributes: [...DEFAULT.attributes] })).toBe(
      readings,
    );
  });

  it("replaces a reading whose attributes changed", () => {
    expect(replaceReading({ [DEFAULT.story.id]: DEFAULT }, { ...DEFAULT, attributes: [] })).toEqual(
      { [DEFAULT.story.id]: { ...DEFAULT, attributes: [] } },
    );
  });
});
