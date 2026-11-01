import { createElement } from "react";
import type { ReactElement } from "react";
import {
  addons,
  types,
  useAddonState,
  useStorybookApi,
  useStorybookState,
} from "storybook/manager-api";
import type { ThemeVars } from "storybook/theming";

import { breadcrumbParts } from "./manager/breadcrumb-parts";
import { hiddenTools } from "./manager/hidden-tools";
import { managerStyle } from "./manager/manager-style";
import {
  readThemeEvent,
  restoreThemeEvent,
  saveThemeEvent,
  THEME_EVENT,
} from "./theme/theme-event";
import type { ThemeEvent } from "./theme/theme-event";
import { THEME_STORES } from "./theme/theme-stores";
import type { Section } from "./theme/theme-stores";
import { docsTheme } from "./theme/theme-tokens";

const ADDON = "osmoz/theme";
const SECTION_STATE = "osmoz/theme/section";
const BREADCRUMB_TOOL = `${ADDON}/breadcrumb`;
const THEME_TOOL = `${ADDON}/tool`;

const STORYBOOK_TOOLS = [
  "menu",
  "remount",
  "isolationMode",
  "zoom",
  "addons",
  "fullscreen",
  "open-in-editor",
];

const SECTION_NAMES: Readonly<Record<Section, string>> = { flux: "Flux", osmoz: "Osmoz" };

const THEME_NAMES = { dark: "Dark", light: "Light" } as const;

const pickerLabel = (section: Section): string => `${SECTION_NAMES[section]} theme`;

const managerTheme = (event: ThemeEvent): ThemeVars => ({
  ...docsTheme(event.tokens),
  brandTarget: "_self",
  brandTitle: event.brandTitle,
  brandUrl: event.brandUrl,
});

const Breadcrumb = (): ReactElement | null => {
  const api = useStorybookApi();

  useStorybookState();

  const title = api.getCurrentStoryData()?.title;

  if (title === undefined) {
    return null;
  }

  const { current, parents } = breadcrumbParts(title);

  return createElement(
    "span",
    { className: "osmoz-breadcrumb" },
    ...parents.flatMap((parent, index) => [
      parent,
      createElement(
        "span",
        { "aria-hidden": true, key: parents.slice(0, index + 1).join("/") },
        " / ",
      ),
    ]),
    createElement("span", { className: "osmoz-breadcrumb-current" }, current),
  );
};

const ThemePicker = (): ReactElement => {
  const [section] = useAddonState<Section>(SECTION_STATE, "osmoz");
  const store = THEME_STORES[section];
  const resolved = store((state) => state.resolved);
  const themes = store((state) => state.themes);
  const setPreference = store((state) => state.setPreference);

  return createElement(
    "div",
    {
      "aria-label": pickerLabel(section),
      className: "osmoz-theme-picker",
      role: "group",
    },
    createElement(
      "span",
      { "aria-hidden": true, className: "osmoz-theme-picker-label" },
      SECTION_NAMES[section],
    ),
    ...themes.map((theme) =>
      createElement(
        "button",
        {
          "aria-pressed": theme === resolved,
          key: theme,
          onClick: (): void => {
            setPreference(theme);
          },
          type: "button",
        },
        THEME_NAMES[theme],
      ),
    ),
  );
};

const style = document.createElement("style");
const cached = restoreThemeEvent();

document.head.append(style);

if (cached !== undefined) {
  style.textContent = managerStyle(cached.tokens);
  addons.setConfig({ theme: managerTheme(cached) });
}

addons.register(ADDON, (api) => {
  if (cached !== undefined) {
    void api.setAddonState(SECTION_STATE, cached.section);
  }

  api.on(THEME_EVENT, (payload: unknown) => {
    const event = readThemeEvent(payload);

    if (event !== undefined) {
      saveThemeEvent(event);
      style.textContent = managerStyle(event.tokens);
      void api.setAddonState(SECTION_STATE, event.section);
      api.setOptions({ theme: managerTheme(event) });
    }
  });

  addons.add(BREADCRUMB_TOOL, {
    render: Breadcrumb,
    title: "Breadcrumb",
    type: types.TOOL,
  });

  addons.add(THEME_TOOL, {
    render: ThemePicker,
    title: "Theme",
    type: types.TOOLEXTRA,
  });

  addons.setConfig({
    toolbar: hiddenTools([
      ...STORYBOOK_TOOLS,
      ...Object.keys(addons.getElements(types.TOOL)),
      ...Object.keys(addons.getElements(types.TOOLEXTRA)),
    ]),
  });
});
