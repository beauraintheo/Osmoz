import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactElement } from "react";
import { expect } from "storybook/test";

import { Spinner } from "./spinner.tsx";

const SPIN_STYLE = `
@keyframes story-spinner-turn {
  to { transform: rotate(360deg); }
}

@media (prefers-reduced-motion: no-preference) {
  .story-spinner-arc {
    animation: story-spinner-turn 1s linear infinite;
    transform-origin: center;
  }
}
`;

const LoadingSvg = (): ReactElement => (
  <svg
    data-testid="icon"
    fill="none"
    height="16"
    style={{ display: "block" }}
    viewBox="0 0 24 24"
    width="16"
  >
    <style>{SPIN_STYLE}</style>
    <path
      className="story-spinner-arc"
      d="M12 3a9 9 0 1 0 9 9"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="2"
    />
  </svg>
);

const meta = {
  args: {
    icon: <LoadingSvg />,
    style: {
      alignItems: "center",
      display: "inline-flex",
      gap: "0.25rem",
    },
  },
  argTypes: {
    icon: {
      control: false,
      description:
        "The animated icon, always hidden from assistive technologies. The app animates it, inside `prefers-reduced-motion: no-preference`.",
    },
    label: {
      description:
        "Turns the spinner into a `status` region that announces this text. Without it, the spinner is decorative.",
    },
    style: { table: { disable: true } },
  },
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
