import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { Spinner } from "./spinner";

const meta = {
  component: Spinner,
  parameters: { app: "flux" },
  tags: ["autodocs"],
  title: "Spinner",
} satisfies Meta<typeof Spinner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLabel: Story = {
  args: { label: "Loading" },
  play: async ({ canvas }): Promise<void> => {
    const status = canvas.getByRole("status");

    await expect(status.querySelector(".sr-only")).toHaveTextContent("Loading");
  },
};
