import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps, ReactElement } from "react";
import { expect } from "storybook/test";

import { Icon } from "./icon.tsx";

const TestSvg = (props: ComponentProps<"svg">): ReactElement => (
  <svg {...props} data-testid="icon" />
);

const meta = {
  args: { icon: TestSvg },
  argTypes: { icon: { control: false } },
  component: Icon,
  title: "Icon",
} satisfies Meta<typeof Icon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Decorative: Story = {
  play: async ({ canvas }): Promise<void> => {
    await expect(canvas.queryByRole("img")).toBeNull();
    await expect(canvas.getByTestId("icon")).toHaveAttribute("aria-hidden", "true");
  },
};

export const WithLabel: Story = {
  args: { label: "Warning" },
  play: async ({ canvas }): Promise<void> => {
    const icon = canvas.getByRole("img", { name: "Warning" });

    await expect(icon).toBe(canvas.getByTestId("icon"));
    await expect(icon).not.toHaveAttribute("aria-hidden");
  },
};
