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
  component: Link,
  decorators: [withRouter],
  parameters: { app: "flux" },
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
