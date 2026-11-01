import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { Link } from "./link.tsx";

const meta = {
  args: { children: "Read the docs", href: "/docs" },
  argTypes: {
    children: { description: "The link text, from the app's catalog." },
    href: { description: "The destination: a URL, or a path of the site." },
    newTab: {
      control: "boolean",
      description: "Opens the destination in a new tab. Requires `newTabHint`.",
      table: { type: { summary: "boolean" } },
    },
    newTabHint: {
      control: "text",
      description:
        "Added after the text so assistive technologies announce the new tab. From the app's catalog, punctuation included.",
      table: { type: { summary: "ReactNode" } },
    },
  },
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
