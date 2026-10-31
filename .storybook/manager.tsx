import { createElement } from "react";
import type { ReactElement } from "react";
import { IconButton } from "storybook/internal/components";
import { addons, types } from "storybook/manager-api";

import { useThemeStore } from "./use-theme-store";

const NEXT_THEME = { dark: "light", light: "dark" } as const;

const LABELS = {
  dark: "Switch to the dark theme",
  light: "Switch to the light theme",
} as const;

const ICON_PATHS = {
  dark: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z",
  light:
    "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0-6v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41",
} as const;

const ThemeTool = (): ReactElement => {
  const resolved = useThemeStore((state) => state.resolved);
  const setPreference = useThemeStore((state) => state.setPreference);
  const next = NEXT_THEME[resolved];

  return createElement(
    IconButton,
    {
      ariaLabel: LABELS[next],
      onClick: (): void => {
        setPreference(next);
      },
    },
    createElement(
      "svg",
      {
        "aria-hidden": true,
        fill: "none",
        height: 14,
        viewBox: "0 0 24 24",
        width: 14,
      },
      createElement("path", {
        d: ICON_PATHS[next],
        stroke: "currentColor",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
      }),
    ),
  );
};

addons.register("osmoz/theme", () => {
  addons.add("osmoz/theme/tool", {
    render: ThemeTool,
    title: "Theme",
    type: types.TOOL,
  });
});
