import { RiArrowRightLine, RiFileCopyLine, RiSaveLine } from "@remixicon/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";

import { Button } from "./button";
import { Icon } from "./icon";

const LABELS = {
  copyCss: "Copy CSS",
  copyHtml: "Copy HTML",
  disabled: "Disabled",
  focusable: "Focusable",
  ghost: "Ghost",
  long: "Export the whole layout as CSS",
  next: "Next",
  primary: "Primary",
  save: "Save",
  saving: "Saving",
  secondary: "Secondary",
  small: "Small",
} as const;

const PARENT = "parent";

const meta = {
  args: {
    children: LABELS.save,
    onClick: fn(),
  },
  argTypes: {
    children: { description: "See Osmoz/Button." },
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
    onClick: { description: "See Osmoz/Button." },
    pending: {
      control: "boolean",
      description: "Adds the spinner before the content and hides its icons. See Osmoz/Button.",
      table: { type: { summary: "boolean" } },
    },
    size: {
      control: "select",
      description:
        "`sm` for dense toolbars. Both sizes grow on a coarse pointer, to stay touchable.",
    },
    type: {
      control: "select",
      description: "See Osmoz/Button.",
      options: ["button", "submit", "reset"],
      table: { type: { summary: '"button" | "submit" | "reset"' } },
    },
    variant: {
      control: "select",
      description:
        "`primary` for the main action of a view, `secondary` for the others, `ghost` for a quiet action in a toolbar.",
    },
  },
  component: Button,
  parameters: {
    app: "flux",
    layout: "fullscreen",
    tokens: {
      "accent-foreground": "Background of a primary action on hover.",
      card: "Background of a secondary action.",
      foreground: "Text and icon of a secondary or ghost action.",
      input: "Border of a secondary action.",
      muted: "Background of a secondary or ghost action on hover.",
      primary: "Background and border of a primary action.",
      "primary-foreground": "Text and icon of a primary action.",
      ring: "Focus outline.",
    },
  },
  tags: ["autodocs"],
  title: "Actions/Button",
} satisfies Meta<typeof Button>;

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
          "`primary` for the main action of a view, `secondary`, the default, for the others, `ghost` for a quiet action in a toolbar.",
      },
    },
  },
  play: async ({ canvas }): Promise<void> => {
    await expect(canvas.getAllByRole("button")).toHaveLength(3);
  },
  render: (): ReturnType<typeof Button> => (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="primary">{LABELS.primary}</Button>
      <Button variant="secondary">{LABELS.secondary}</Button>
      <Button variant="ghost">{LABELS.ghost}</Button>
    </div>
  ),
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: "`sm` for dense toolbars. Both sizes grow on a coarse pointer, to stay touchable.",
      },
    },
  },
  play: async ({ canvas }): Promise<void> => {
    await expect(canvas.getAllByRole("button")).toHaveLength(2);
  },
  render: (): ReturnType<typeof Button> => (
    <div className="flex flex-wrap items-center gap-2">
      <Button>{LABELS.save}</Button>
      <Button size="sm">{LABELS.small}</Button>
    </div>
  ),
};

export const States: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Disabled, disabled but still focusable, and pending. A pending button shows the spinner in place of its icon.",
      },
    },
  },
  play: async ({ canvas }): Promise<void> => {
    await expect(canvas.getByRole("button", { name: LABELS.disabled })).toBeDisabled();
    await expect(canvas.getByRole("button", { name: LABELS.focusable })).toHaveAttribute(
      "aria-disabled",
      "true",
    );

    const pending = canvas.getByRole("button", { name: LABELS.saving });
    const [spinner, icon] = pending.children;

    await expect(pending).toHaveAttribute("aria-busy", "true");
    await expect(spinner).toBeVisible();
    await expect(icon).not.toBeVisible();
  },
  render: (): ReturnType<typeof Button> => (
    <div className="flex flex-wrap items-center gap-2">
      <Button disabled>{LABELS.disabled}</Button>
      <Button disabled focusableWhenDisabled>
        {LABELS.focusable}
      </Button>
      <Button pending variant="primary">
        <Icon icon={RiSaveLine} />
        {LABELS.saving}
      </Button>
    </div>
  ),
};

export const WithIcon: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "An icon goes before the label, or after it for an action that moves forward. It is decorative: the label names the action.",
      },
    },
  },
  play: async ({ canvas }): Promise<void> => {
    const save = canvas.getByRole("button", { name: LABELS.save });
    const next = canvas.getByRole("button", { name: LABELS.next });

    await expect(save.firstElementChild).toHaveAttribute("aria-hidden", "true");
    await expect(next.lastElementChild).toHaveAttribute("aria-hidden", "true");
  },
  render: (): ReturnType<typeof Button> => (
    <div className="flex flex-wrap items-center gap-2">
      <Button>
        <Icon icon={RiSaveLine} />
        {LABELS.save}
      </Button>
      <Button>
        {LABELS.next}
        <Icon icon={RiArrowRightLine} />
      </Button>
    </div>
  ),
};

export const InAToolbar: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "One primary action per view, next to secondary ones: the export bar of the generated code.",
      },
    },
  },
  play: async ({ canvas }): Promise<void> => {
    await expect(canvas.getAllByRole("button")).toHaveLength(2);
  },
  render: (): ReturnType<typeof Button> => (
    <div className="flex gap-2">
      <Button variant="primary">
        <Icon icon={RiFileCopyLine} />
        {LABELS.copyCss}
      </Button>
      <Button>
        <Icon icon={RiFileCopyLine} />
        {LABELS.copyHtml}
      </Button>
    </div>
  ),
};

export const LongLabel: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "In a narrow parent, the label wraps and the button grows taller to hold it. The icon keeps its size.",
      },
    },
  },
  play: async ({ canvas }): Promise<void> => {
    const parent = canvas.getByTestId(PARENT).getBoundingClientRect().width;
    const buttons = canvas.getAllByRole("button", { name: LABELS.long });
    const sizes = buttons.map((button) => ({
      fits: button.scrollHeight === button.clientHeight,
      ...button.getBoundingClientRect().toJSON(),
    }));

    await expect(sizes).toHaveLength(2);
    await expect(sizes.every(({ width }) => width <= parent)).toBe(true);
    await expect(sizes.every(({ height }) => height > 32)).toBe(true);
    await expect(sizes.every(({ fits }) => fits)).toBe(true);
    await expect(buttons[1]?.querySelector("svg")?.getBoundingClientRect().width).toBe(16);
  },
  render: (): ReturnType<typeof Button> => (
    <div className="flex w-40 flex-col items-start gap-2" data-testid={PARENT}>
      <Button>{LABELS.long}</Button>
      <Button>
        <Icon icon={RiSaveLine} />
        {LABELS.long}
      </Button>
    </div>
  ),
  tags: ["edge-case"],
};

export const TruncatedLabel: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Where a label must stay on one line, like in a toolbar, wrap it in a `truncate` span: it ends with an ellipsis and the button keeps its height. The accessible name stays whole.",
      },
    },
  },
  play: async ({ canvas }): Promise<void> => {
    const parent = canvas.getByTestId(PARENT).getBoundingClientRect().width;
    const button = canvas.getByRole("button", { name: LABELS.long });
    const { height, width } = button.getBoundingClientRect();
    const label = button.querySelector("span");

    await expect(width).toBeLessThanOrEqual(parent);
    await expect(height).toBe(32);
    await expect(label?.scrollWidth).toBeGreaterThan(label?.clientWidth ?? 0);
  },
  render: (): ReturnType<typeof Button> => (
    <div className="w-40" data-testid={PARENT}>
      <Button>
        <Icon icon={RiSaveLine} />
        <span className="min-w-0 truncate">{LABELS.long}</span>
      </Button>
    </div>
  ),
  tags: ["edge-case"],
};

export const PendingKeepsItsWidth: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "With an icon, the spinner takes the icon's place: the button keeps its width while the action runs, and nothing around it moves.",
      },
    },
  },
  play: async ({ canvas }): Promise<void> => {
    const [idle, pending] = canvas.getAllByRole("button", { name: LABELS.save });

    await expect(pending).toHaveAttribute("aria-busy", "true");
    await expect(pending?.getBoundingClientRect().width).toBe(idle?.getBoundingClientRect().width);
  },
  render: (): ReturnType<typeof Button> => (
    <div className="flex flex-col items-start gap-2">
      <Button variant="primary">
        <Icon icon={RiSaveLine} />
        {LABELS.save}
      </Button>
      <Button pending variant="primary">
        <Icon icon={RiSaveLine} />
        {LABELS.save}
      </Button>
    </div>
  ),
  tags: ["edge-case"],
};
