import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterContextProvider,
} from "@tanstack/react-router";
import { expect } from "storybook/test";

import { Link } from "./link";

const router = createRouter({ history: createMemoryHistory(), routeTree: createRootRoute() });

const withRouter: Decorator = (Story) => (
  <RouterContextProvider router={router}>
    <Story />
  </RouterContextProvider>
);

const meta = {
  args: { children: "Read the docs", to: "/" },
  argTypes: {
    children: { description: "See UI/Link." },
    newTab: {
      control: "boolean",
      description: "See UI/Link.",
      table: { type: { summary: "boolean" } },
    },
    newTabHint: {
      control: "text",
      description: "Visually hidden, read after the text. See UI/Link.",
      table: { type: { summary: "ReactNode" } },
    },
    to: { description: "A route of the app, typed by TanStack Router." },
    variant: {
      control: "inline-radio",
      description:
        "`inline` for a link in running text, `quiet` for a secondary link outside it, like in a header.",
      options: ["inline", "quiet"],
      table: { defaultValue: { summary: "inline" }, type: { summary: '"inline" | "quiet"' } },
    },
  },
  component: Link,
  decorators: [withRouter],
  parameters: { app: "flux", layout: "fullscreen" },
  tags: ["autodocs"],
  title: "Link",
} satisfies Meta<typeof Link>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Inline: Story = {};

export const Quiet: Story = {
  args: { variant: "quiet" },
};

export const NewTab: Story = {
  args: { newTab: true, newTabHint: "(new tab)" },
  play: async ({ canvas }): Promise<void> => {
    const link = canvas.getByRole("link", { name: "Read the docs (new tab)" });

    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link.querySelector(".sr-only")).toHaveTextContent("(new tab)");
  },
};
