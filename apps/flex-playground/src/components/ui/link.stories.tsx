import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterContextProvider,
} from "@tanstack/react-router";
import { expect } from "storybook/test";

import { Link } from "./link";

const LABELS = {
  after: "for every value of the property.",
  before: "The playground shows",
  docs: "Read the docs",
  long: "a diagram and an explanation",
  mdn: "MDN",
  newTab: "(new tab)",
  quiet: "Exercises",
} as const;

const router = createRouter({ history: createMemoryHistory(), routeTree: createRootRoute() });

const withRouter: Decorator = (Story) => (
  <RouterContextProvider router={router}>
    <Story />
  </RouterContextProvider>
);

const meta = {
  args: {
    children: LABELS.docs,
    to: "/",
  },
  argTypes: {
    children: { description: "See Osmoz/Link." },
    newTab: {
      control: "boolean",
      description: "See Osmoz/Link.",
      table: { type: { summary: "boolean" } },
    },
    newTabHint: {
      control: "text",
      description: "Visually hidden, read after the text. See Osmoz/Link.",
      table: { type: { summary: "ReactNode" } },
    },
    to: { description: "A route of the app, typed by TanStack Router." },
    variant: {
      control: "select",
      description:
        "`inline` for a link in running text, `quiet` for a secondary link outside it, like in a header.",
      options: ["inline", "quiet"],
      table: { defaultValue: { summary: "inline" }, type: { summary: '"inline" | "quiet"' } },
    },
  },
  component: Link,
  decorators: [withRouter],
  parameters: {
    app: "flux",
    layout: "fullscreen",
    tokens: {
      "accent-foreground": "Text of an inline link on hover.",
      foreground: "Text of a quiet link on hover.",
      "muted-foreground": "Text of a quiet link.",
      primary: "Text of an inline link.",
      ring: "Focus outline.",
    },
  },
  tags: ["autodocs"],
  title: "Navigation/Link",
} satisfies Meta<typeof Link>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: { actions: { disable: false }, controls: { disable: false } },
};

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`inline`, the default, in running text; `quiet` for a secondary link outside it, like in a header.",
      },
    },
  },
  play: async ({ canvas }): Promise<void> => {
    await expect(canvas.getAllByRole("link")).toHaveLength(2);
  },
  render: (): ReturnType<typeof Link> => (
    <div className="flex items-center gap-6">
      <Link to="/" variant="inline">
        {LABELS.docs}
      </Link>
      <Link to="/" variant="quiet">
        {LABELS.quiet}
      </Link>
    </div>
  ),
};

export const NewTab: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "For a page outside Flux, like MDN. `newTabHint` is read after the text, so the visitor knows before following it.",
      },
    },
  },
  play: async ({ canvas }): Promise<void> => {
    const link = canvas.getByRole("link", { name: `${LABELS.mdn} ${LABELS.newTab}` });

    await expect(link).toHaveAttribute("target", "_blank");
  },
  render: (): ReturnType<typeof Link> => (
    <Link newTab newTabHint={LABELS.newTab} to="/">
      {LABELS.mdn}
    </Link>
  ),
};

export const WrapsInRunningText: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "In a paragraph, a long link wraps with the text around it and keeps its underline on every line.",
      },
    },
  },
  play: async ({ canvas }): Promise<void> => {
    const link = canvas.getByRole("link", { name: LABELS.long });

    await expect(link.getClientRects().length).toBeGreaterThan(1);
  },
  render: (): ReturnType<typeof Link> => (
    <p className="w-48 text-body">
      {LABELS.before} <Link to="/">{LABELS.long}</Link> {LABELS.after}
    </p>
  ),
  tags: ["edge-case"],
};
