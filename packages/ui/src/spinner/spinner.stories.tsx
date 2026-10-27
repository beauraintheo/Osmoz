import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { Spinner } from "./spinner.tsx";

const meta = {
  args: { icon: <svg data-testid="icon" /> },
  argTypes: { icon: { control: false } },
  component: Spinner,
  title: "Spinner",
} satisfies Meta<typeof Spinner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }): Promise<void> => {
    await expect(canvas.queryByRole("status")).toBeNull();
    await expect(canvas.getByTestId("icon").parentElement).toHaveAttribute("aria-hidden", "true");
  },
};

export const WithLabel: Story = {
  args: { label: "Loading" },
  play: async ({ canvas }): Promise<void> => {
    const status = canvas.getByRole("status");

    await expect(status).toHaveTextContent("Loading");
    await expect(canvas.getByTestId("icon").parentElement).toHaveAttribute("aria-hidden", "true");
  },
};
