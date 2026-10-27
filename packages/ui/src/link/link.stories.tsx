import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { Link } from "./link.tsx";

const meta = {
  args: { children: "Read the docs", href: "/docs" },
  component: Link,
  title: "Link",
} satisfies Meta<typeof Link>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, userEvent }): Promise<void> => {
    const link = canvas.getByRole("link", { name: "Read the docs" });

    await expect(link).toHaveAttribute("href", "/docs");
    await expect(link).not.toHaveAttribute("target");

    await userEvent.tab();
    await expect(link).toHaveFocus();
  },
};

export const NewTab: Story = {
  args: { newTab: true, newTabHint: " (new tab)" },
  play: async ({ canvas }): Promise<void> => {
    const link = canvas.getByRole("link", { name: "Read the docs (new tab)" });

    await expect(link).toHaveAttribute("target", "_blank");
  },
};
