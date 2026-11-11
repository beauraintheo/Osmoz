import { describe, expect, it } from "vite-plus/test";

import { addedProps, argOptions, pageTokens, uiStoryId } from "./page-data";

const INDEX = {
  entries: {
    "flux-button--primary": {
      id: "flux-button--primary",
      title: "Flux/Button",
      type: "story",
    },
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
        "flux-actions-button--primary": {
          id: "flux-actions-button--primary",
          title: "Flux/Actions/Button",
          type: "story",
        },
        "osmoz-actions-button--default": {
          id: "osmoz-actions-button--default",
          title: "Osmoz/Actions/Button",
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

describe("argOptions", () => {
  it("reads the options of a prop, in their order", () => {
    expect(argOptions({ name: "variant", options: ["ghost", "primary", "secondary"] })).toEqual([
      "ghost",
      "primary",
      "secondary",
    ]);
  });

  it("reads no option for a prop without a fixed set of values", () => {
    expect(argOptions({ name: "children" })).toEqual([]);
  });

  it("reads no option for a prop the component does not have", () => {
    expect(argOptions(undefined)).toEqual([]);
  });
});

describe("pageTokens", () => {
  it("lists each token the stories declare, with its role", () => {
    expect(
      pageTokens({
        app: "flux",
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
    expect(pageTokens({ app: "flux" })).toEqual([]);
  });

  it("lists nothing when a role is not a text", () => {
    expect(pageTokens({ tokens: { primary: 1 } })).toEqual([]);
  });
});
