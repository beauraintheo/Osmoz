import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";

import { Button } from "./button.tsx";

const meta = {
  args: {
    children: "Save",
    onClick: fn(),
  },
  argTypes: {
    children: {
      description:
        "The label, from the app's catalog. An icon beside it goes in a decorative Icon.",
    },
    disabled: {
      control: "boolean",
      description: "Removes the button from the tab order and blocks its action.",
      table: { type: { summary: "boolean" } },
    },
    focusableWhenDisabled: {
      description:
        "With `disabled`, keeps the button in the tab order and sets `aria-disabled` instead, so the user can still reach it and learn why it is unavailable.",
    },
    onClick: {
      description: "Runs on click, Enter and Space. Not called while disabled or pending.",
    },
    pending: {
      description:
        "The action is running: sets `aria-busy`, blocks the action and keeps the focus on the button.",
    },
    type: {
      control: "select",
      description:
        "Defaults to `button`, so the button never submits its form by accident. Pass `submit` on purpose.",
      options: ["button", "submit", "reset"],
      table: {
        defaultValue: { summary: '"button"' },
        type: { summary: '"button" | "submit" | "reset"' },
      },
    },
  },
  component: Button,
  title: "Actions/Button",
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: { actions: { disable: false }, controls: { disable: false } },
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
  tags: ["!dev"],
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
  tags: ["!dev"],
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
  tags: ["!dev"],
};

export const PendingWinsOverDisabled: Story = {
  args: {
    disabled: false,
    focusableWhenDisabled: false,
    pending: true,
  },
  play: async ({ args, canvas, userEvent }): Promise<void> => {
    const button = canvas.getByRole("button");

    await expect(button).toHaveAttribute("aria-busy", "true");
    await expect(button).toHaveAttribute("aria-disabled", "true");

    await userEvent.tab();
    await expect(button).toHaveFocus();

    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
  tags: ["!dev", "edge-case"],
};

const submitForm = fn();

export const NeverSubmitsItsForm: Story = {
  play: async ({ args, canvas, userEvent }): Promise<void> => {
    await userEvent.click(canvas.getByRole("button"));

    await expect(args.onClick).toHaveBeenCalledOnce();
    await expect(submitForm).not.toHaveBeenCalled();
  },
  render: (args): ReturnType<typeof Button> => (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submitForm();
      }}
    >
      <Button {...args} />
    </form>
  ),
  tags: ["!dev", "edge-case"],
};
