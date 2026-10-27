import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";

import { Button } from "./button.tsx";

const meta = {
  args: { children: "Save", onClick: fn() },
  component: Button,
  title: "Button",
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, userEvent }): Promise<void> => {
    const button = canvas.getByRole("button");

    await expect(button).toHaveAttribute("type", "button");
    await expect(button).not.toHaveAttribute("aria-busy");
    await expect(button).not.toHaveAttribute("aria-disabled");

    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas, userEvent }): Promise<void> => {
    const button = canvas.getByRole("button");

    await expect(button).toBeDisabled();
    await userEvent.tab();
    await expect(button).not.toHaveFocus();
  },
};

export const FocusableWhenDisabled: Story = {
  args: { disabled: true, focusableWhenDisabled: true },
  play: async ({ args, canvas, userEvent }): Promise<void> => {
    const button = canvas.getByRole("button");

    await expect(button).toBeEnabled();
    await expect(button).toHaveAttribute("aria-disabled", "true");

    await userEvent.tab();
    await expect(button).toHaveFocus();

    await userEvent.keyboard("{Enter}");
    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const Pending: Story = {
  args: { pending: true },
  play: async ({ args, canvas, userEvent }): Promise<void> => {
    const button = canvas.getByRole("button");

    await expect(button).toHaveAttribute("aria-busy", "true");
    await expect(button).toHaveAttribute("aria-disabled", "true");

    await userEvent.tab();
    await expect(button).toHaveFocus();

    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};
