import { RiArrowGoBackLine, RiArrowGoForwardLine, RiDeleteBinLine } from "@remixicon/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";

import { IconButton } from "./icon-button";

const LABELS = {
  delete: "Delete",
  disabled: "Redo",
  focusable: "Delete item",
  pending: "Saving",
  redo: "Redo",
  undo: "Undo",
} as const;

const meta = {
  args: {
    icon: RiArrowGoBackLine,
    label: LABELS.undo,
    onClick: fn(),
  },
  argTypes: {
    disabled: {
      control: "boolean",
      description: "See Osmoz/Button.",
      table: { type: { summary: "boolean" } },
    },
    focusableWhenDisabled: {
      control: "boolean",
      description: "See Osmoz/Button.",
      table: { type: { summary: "boolean" } },
    },
    icon: {
      control: false,
      description: "A Remix icon component, sized by `size`.",
      table: { type: { summary: "ComponentType<SVGProps>" } },
    },
    label: { description: "See Osmoz/IconButton." },
    onClick: { description: "See Osmoz/Button." },
    pending: {
      control: "boolean",
      description: "Replaces the icon with the spinner. See Osmoz/Button.",
      table: { type: { summary: "boolean" } },
    },
    size: { control: "select", description: "See Flux/Button." },
    type: {
      control: "select",
      description: "See Osmoz/Button.",
      options: ["button", "submit", "reset"],
      table: { type: { summary: '"button" | "submit" | "reset"' } },
    },
    variant: {
      control: "select",
      description: "`ghost` by default, the usual look of a toolbar action. See Flux/Button.",
    },
  },
  component: IconButton,
  parameters: {
    app: "flux",
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  title: "Actions/IconButton",
} satisfies Meta<typeof IconButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: { actions: { disable: false }, controls: { disable: false } },
};

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The looks of Flux/Button. `ghost`, the default, for a toolbar; `secondary` or `primary` when the action stands alone.",
      },
    },
  },
  play: async ({ canvas }): Promise<void> => {
    await expect(canvas.getAllByRole("button")).toHaveLength(3);
  },
  render: (): ReturnType<typeof IconButton> => (
    <div className="flex items-center gap-2">
      <IconButton icon={RiArrowGoBackLine} label={LABELS.undo} variant="ghost" />
      <IconButton icon={RiArrowGoBackLine} label={LABELS.undo} variant="secondary" />
      <IconButton icon={RiArrowGoBackLine} label={LABELS.undo} variant="primary" />
    </div>
  ),
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: "The sizes of Flux/Button: square, and larger on a coarse pointer.",
      },
    },
  },
  play: async ({ canvas }): Promise<void> => {
    await expect(canvas.getAllByRole("button")).toHaveLength(2);
  },
  render: (): ReturnType<typeof IconButton> => (
    <div className="flex items-center gap-2">
      <IconButton icon={RiArrowGoBackLine} label={LABELS.undo} variant="secondary" />
      <IconButton icon={RiArrowGoBackLine} label={LABELS.undo} size="sm" variant="secondary" />
    </div>
  ),
};

export const States: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Disabled, disabled but still focusable, and pending: the spinner replaces the icon.",
      },
    },
  },
  play: async ({ canvas }): Promise<void> => {
    const pending = canvas.getByRole("button", { name: LABELS.pending });

    await expect(canvas.getByRole("button", { name: LABELS.disabled })).toBeDisabled();
    await expect(canvas.getByRole("button", { name: LABELS.focusable })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    await expect(pending).toHaveAttribute("aria-busy", "true");
    await expect(pending.querySelectorAll("svg")).toHaveLength(1);
  },
  render: (): ReturnType<typeof IconButton> => (
    <div className="flex items-center gap-2">
      <IconButton disabled icon={RiArrowGoForwardLine} label={LABELS.disabled} />
      <IconButton disabled focusableWhenDisabled icon={RiDeleteBinLine} label={LABELS.focusable} />
      <IconButton icon={RiArrowGoBackLine} label={LABELS.pending} pending />
    </div>
  ),
};

export const InAToolbar: Story = {
  parameters: {
    docs: {
      description: {
        story: "Ghost icon buttons side by side: the history controls of the playground.",
      },
    },
  },
  play: async ({ canvas }): Promise<void> => {
    await expect(canvas.getAllByRole("button")).toHaveLength(3);
  },
  render: (): ReturnType<typeof IconButton> => (
    <div className="flex items-center gap-1">
      <IconButton icon={RiArrowGoBackLine} label={LABELS.undo} />
      <IconButton icon={RiArrowGoForwardLine} label={LABELS.redo} />
      <IconButton icon={RiDeleteBinLine} label={LABELS.delete} />
    </div>
  ),
};

export const StaysSquare: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "In a row that stretches its children, the button keeps its square size instead of growing to the row's height.",
      },
    },
  },
  play: async ({ canvas }): Promise<void> => {
    const { height, width } = canvas.getByRole("button").getBoundingClientRect();

    await expect(height).toBe(width);
  },
  render: (): ReturnType<typeof IconButton> => (
    <div className="flex h-16 items-stretch">
      <IconButton icon={RiArrowGoBackLine} label={LABELS.undo} variant="secondary" />
    </div>
  ),
  tags: ["edge-case"],
};
