import { describe, expect, it } from "vite-plus/test";

import { addedProps, importSnippet, pageStories, pageTokens, uiStoryId } from "./page-data";

const INDEX = {
  entries: {
    "osmoz-button--default": {
      id: "osmoz-button--default",
      title: "Osmoz/Button",
      type: "story",
    },
    "osmoz-button--docs": {
      id: "osmoz-button--docs",
      title: "Osmoz/Button",
      type: "docs",
    },
    "osmoz-css-button--primary": {
      id: "osmoz-css-button--primary",
      title: "osmoz.css/Button",
      type: "story",
    },
  },
  v: 5,
};

const DOCS_ONLY = {
  entries: {
    "osmoz-link--docs": {
      id: "osmoz-link--docs",
      title: "Osmoz/Link",
      type: "docs",
    },
  },
};

describe("uiStoryId", () => {
  it("finds a story of the Osmoz component with the same name", () => {
    expect(uiStoryId(INDEX, "Button")).toBe("osmoz-button--default");
  });

  it("finds the Osmoz component inside its group", () => {
    const grouped = {
      entries: {
        "osmoz-actions-button--default": {
          id: "osmoz-actions-button--default",
          title: "Osmoz/Actions/Button",
          type: "story",
        },
        "osmoz-css-actions-button--primary": {
          id: "osmoz-css-actions-button--primary",
          title: "osmoz.css/Actions/Button",
          type: "story",
        },
      },
    };

    expect(uiStoryId(grouped, "Button")).toBe("osmoz-actions-button--default");
  });

  it("skips the doc entries, which carry no args", () => {
    expect(uiStoryId(DOCS_ONLY, "Link")).toBeUndefined();
  });

  it("finds nothing for a component Osmoz does not have", () => {
    expect(uiStoryId(INDEX, "Header")).toBeUndefined();
  });

  it("finds nothing in a payload that is not a story index", () => {
    expect(uiStoryId({ entries: "none" }, "Button")).toBeUndefined();
  });
});

describe("addedProps", () => {
  it("keeps the props the Osmoz component does not have", () => {
    expect(
      addedProps(
        {
          children: {},
          size: {},
          variant: {},
        },
        { children: {}, pending: {} },
      ),
    ).toEqual(["size", "variant"]);
  });

  it("keeps nothing when the app only styles the Osmoz props", () => {
    expect(addedProps({ orientation: {} }, { decorative: {}, orientation: {} })).toEqual([]);
  });
});

describe("pageTokens", () => {
  it("lists each token the stories declare, with its role", () => {
    expect(
      pageTokens({
        app: "osmoz-css",
        tokens: {
          input: "Border of a secondary action.",
          primary: "Background of the main action.",
        },
      }),
    ).toEqual([
      { name: "input", role: "Border of a secondary action." },
      { name: "primary", role: "Background of the main action." },
    ]);
  });

  it("lists nothing when the stories declare no token", () => {
    expect(pageTokens({ app: "osmoz-css" })).toEqual([]);
  });

  it("lists nothing when a role is not a text", () => {
    expect(pageTokens({ tokens: { primary: 1 } })).toEqual([]);
  });
});

describe("importSnippet", () => {
  it("imports the component from the file next to its stories", () => {
    expect(
      importSnippet("IconButton", {
        fileName: "./apps/osmoz-css/src/components/ui/icon-button.stories.tsx",
      }),
    ).toBe('import { IconButton } from "@/components/ui/icon-button";');
  });

  it("writes nothing for stories outside an app's src", () => {
    expect(
      importSnippet("Button", { fileName: "./packages/ui/button/button.stories.tsx" }),
    ).toBeUndefined();
  });

  it("writes nothing without the stories' file name", () => {
    expect(importSnippet("Button", {})).toBeUndefined();
  });
});

describe("pageStories", () => {
  const story = (name: string, tags: string[] = []): { name: string; tags: string[] } => ({
    name,
    tags,
  });

  it("splits the stories into the sections of the page, in their order", () => {
    const stories = [
      story("Default"),
      story("Variants"),
      story("Long label", ["edge-case"]),
      story("Sizes"),
      story("Narrow parent", ["edge-case"]),
    ];

    expect(pageStories(stories)).toEqual({
      default: story("Default"),
      edgeCases: [story("Long label", ["edge-case"]), story("Narrow parent", ["edge-case"])],
      examples: [story("Variants"), story("Sizes")],
    });
  });

  it("always shows the first story on top, whatever its tags", () => {
    expect(pageStories([story("Default", ["edge-case"])]).default).toEqual(
      story("Default", ["edge-case"]),
    );
  });

  it("leaves every section empty without stories", () => {
    expect(pageStories([])).toEqual({
      default: undefined,
      edgeCases: [],
      examples: [],
    });
  });
});
