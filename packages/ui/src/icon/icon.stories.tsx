import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps, ReactElement } from "react";
import { expect } from "storybook/test";

import { Icon } from "./icon.tsx";

const TestSvg = (props: ComponentProps<"svg">): ReactElement => (
  <svg
    {...props}
    data-testid="icon"
    fill="none"
    height="16"
    style={{ display: "block" }}
    viewBox="0 0 24 24"
    width="16"
  >
    <path
      d="M12 3 2 21h20L12 3Zm0 7v4m0 3v.01"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);

const meta = {
  args: { icon: TestSvg },
  argTypes: {
    icon: {
      control: false,
      description: "The SVG component to render. It receives every other prop.",
    },
    label: {
      description:
        "Makes the icon meaningful: role `img`, named by this text. Without it, the icon is decorative and hidden from assistive technologies.",
    },
  },
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

export const WithSvgProps: Story = {
  args: { id: "warning-icon" },
  play: async ({ canvas }): Promise<void> => {
    await expect(canvas.getByTestId("icon")).toHaveAttribute("id", "warning-icon");
  },
};
