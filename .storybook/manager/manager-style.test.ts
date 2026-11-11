import { describe, expect, it } from "vite-plus/test";

import type { ThemeTokens } from "../theme/theme-tokens";
import { managerStyle } from "./manager-style";

const TOKENS: ThemeTokens = {
  accent: "#252b5e",
  accentForeground: "#ede8ff",
  background: "#101828",
  border: "#202838",
  card: "#303848",
  colorScheme: "dark",
  fontCode: "Code Font, monospace",
  fontText: "Text Font, sans-serif",
  foreground: "#f0f4f8",
  input: "#505868",
  muted: "#404858",
  mutedForeground: "#a0a8b8",
  osmozCloud: "#9c8cff",
  osmozO: "#ff8fb8",
  primary: "#8070f0",
};

const styled = (html: string): HTMLElement => {
  const host = document.createElement("div");
  const style = document.createElement("style");

  style.textContent = managerStyle(TOKENS);
  host.innerHTML = html;
  document.head.appendChild(style);
  document.body.appendChild(host);

  return host;
};

const colorOf = (element: Element | null): string =>
  element === null ? "" : getComputedStyle(element).color;

describe("managerStyle", () => {
  it("colors the Osmoz mark with the tokens of the active theme", () => {
    styled("");

    const root = getComputedStyle(document.documentElement);

    expect(root.getPropertyValue("--osmoz-o").trim()).toBe(TOKENS.osmozO);
    expect(root.getPropertyValue("--osmoz-cloud").trim()).toBe(TOKENS.osmozCloud);
  });

  it("gives the selected sidebar item the accent pair", () => {
    const item = styled('<div class="sidebar-item" data-selected="true"></div>').firstElementChild;

    expect(item === null ? "" : getComputedStyle(item).backgroundColor).toBe("rgb(37, 43, 94)");
    expect(colorOf(item)).toBe("rgb(237, 232, 255)");
  });

  it.each(["context-menu", "tree-change-status-button"])(
    "keeps the %s button of the selected item on the accent, without a glow",
    (testId) => {
      const button = styled(
        `<div class="sidebar-item" data-selected="true"><button data-testid="${testId}"></button></div>`,
      ).querySelector("button");
      const styles = button === null ? undefined : getComputedStyle(button);

      expect(styles?.backgroundColor).toBe("rgb(37, 43, 94)");
      expect(styles?.boxShadow).toBe("none");
    },
  );

  it.each(["true", "false"])(
    "keeps the icons of the item's buttons muted when selected is %s",
    (selected) => {
      const buttons = styled(
        `<div class="sidebar-item" data-selected="${selected}"><button data-testid="context-menu"><svg></svg></button><button data-testid="tree-change-status-button"><svg></svg></button></div>`,
      ).querySelectorAll("button");

      expect(
        [...buttons].flatMap((button) => [colorOf(button), colorOf(button.querySelector("svg"))]),
      ).toEqual(Array.from({ length: 4 }, () => "rgb(160, 168, 184)"));
    },
  );

  it("spaces every group of the sidebar but the first by 24px", () => {
    const host = styled(
      '<div><div class="sidebar-subheading" data-nodetype="root"></div><div class="sidebar-subheading" data-nodetype="root"></div></div>',
    );
    const [first, second] = host.querySelectorAll(".sidebar-subheading");

    expect(first === undefined ? "" : getComputedStyle(first).marginTop).toBe("0px");
    expect(second === undefined ? "" : getComputedStyle(second).marginTop).toBe("24px");
  });

  it("gives the toolbar its height and side margins", () => {
    const toolbar = styled(
      '<div data-testid="sb-preview-toolbar"><div></div></div>',
    ).firstElementChild;
    const inner = toolbar?.firstElementChild;
    const styles = inner === null || inner === undefined ? undefined : getComputedStyle(inner);

    expect(styles?.height).toBe("56px");
    expect(styles?.marginLeft).toBe("40px");
    expect(styles?.marginRight).toBe("40px");
  });

  it("colors the selected tab with the primary token and the others muted", () => {
    const host = styled(
      '<div role="tab" aria-selected="true"></div><div role="tab" aria-selected="false"></div>',
    );

    expect(colorOf(host.querySelector('[aria-selected="true"]'))).toBe("rgb(128, 112, 240)");
    expect(colorOf(host.querySelector('[aria-selected="false"]'))).toBe("rgb(160, 168, 184)");
  });
});
