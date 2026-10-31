import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";

import { IconButton } from "./icon-button.tsx";

const meta = {
  args: {
    icon: (
      <svg fill="none" height="16" style={{ display: "block" }} viewBox="0 0 24 24" width="16">
        <path
          d="M9 14 4 9l5-5M4 9h10.5a5.5 5.5 0 0 1 0 11H11"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    ),
    label: "Undo",
    onClick: fn(),
  },
  argTypes: { icon: { control: false } },
  component: IconButton,
  title: "IconButton",
} satisfies Meta<typeof IconButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, userEvent }): Promise<void> => {
    const button = canvas.getByRole("button", { name: "Undo" });

    await expect(button).toHaveAttribute("aria-label", "Undo");
    await expect(button.querySelector("[aria-hidden='true'] svg")).not.toBeNull();

    await userEvent.tab();
    await expect(button).toHaveFocus();

    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas, userEvent }): Promise<void> => {
    const button = canvas.getByRole("button", { name: "Undo" });

    await expect(button).toBeDisabled();
    await userEvent.tab();
    await expect(button).not.toHaveFocus();
  },
};

export const Pending: Story = {
  args: { pending: true },
  play: async ({ args, canvas, userEvent }): Promise<void> => {
    const button = canvas.getByRole("button", { name: "Undo" });

    await expect(button).toHaveAttribute("aria-busy", "true");
    await expect(button).toHaveAttribute("aria-disabled", "true");

    await userEvent.tab();
    await expect(button).toHaveFocus();

    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};
