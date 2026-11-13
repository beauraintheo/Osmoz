import { useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import type { CSSProperties, ReactElement, ReactNode } from "react";
import { addons } from "storybook/preview-api";
import { themes } from "storybook/theming";
import type { ThemeVars } from "storybook/theming";

import { docsPath } from "../docs/docs-link";
import { brandTitle } from "../manager/brand-title";
import { paintPreview } from "./preview-paint";
import { THEME_EVENT } from "./theme-event";
import type { ThemeEvent } from "./theme-event";
import { THEME_STORES } from "./theme-stores";
import type { Section } from "./theme-stores";
import { docsTheme, readThemeTokens } from "./theme-tokens";
import type { FontTokens } from "./theme-tokens";

import fluxTheme from "../../apps/flex-playground/src/theme/theme.css?inline";
import osmozTheme from "@osmoz/brand/osmoz-theme.css?inline";

interface SectionLook {
  brand: string;
  brandUrl: string;
  fonts: FontTokens;
  style: string;
  themeName: (theme: string) => string;
}

const SECTION_LOOKS: Readonly<Record<Section, SectionLook>> = {
  flux: {
    brand: brandTitle({
      mono: true,
      name: "Flux",
      tagline: "Design system",
    }),
    brandUrl: `./${docsPath("flux-introduction")}`,
    fonts: { code: "font-mono", text: "font-sans" },
    style: fluxTheme,
    themeName: (theme) => theme,
  },
  osmoz: {
    brand: brandTitle({
      mono: false,
      name: "Osmoz",
      tagline: "Design system",
    }),
    brandUrl: `./${docsPath("osmoz-introduction")}`,
    fonts: { code: "osmoz-font-mono", text: "osmoz-font-sans" },
    style: osmozTheme,
    themeName: (theme) => `osmoz-${theme}`,
  },
};

export type Variant = "page" | "canvas" | "block" | "bare";

const VARIANT_STYLES: Readonly<Record<Variant, CSSProperties>> = {
  bare: { display: "contents" },
  block: { padding: "1rem" },
  canvas: { minHeight: "100vh", padding: "1rem" },
  page: { minHeight: "100vh" },
};

const ANNOUNCES_THEME: Readonly<Record<Variant, boolean>> = {
  bare: true,
  block: false,
  canvas: true,
  page: true,
};

const paint = (variant: Variant, fonts: FontTokens): CSSProperties =>
  variant === "bare"
    ? VARIANT_STYLES.bare
    : {
        background: "var(--background)",
        boxSizing: "border-box",
        color: "var(--foreground)",
        fontFamily: `var(--${fonts.text})`,
        ...VARIANT_STYLES[variant],
      };

interface ThemeSurfaceProps {
  children: (theme: ThemeVars) => ReactNode;
  section: Section;
  variant: Variant;
}

export const ThemeSurface = ({ children, section, variant }: ThemeSurfaceProps): ReactElement => {
  const store = THEME_STORES[section];
  const resolved = useSyncExternalStore(store.subscribe, () => store.getState().resolved);
  const look = SECTION_LOOKS[section];
  const surface = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<ThemeVars>(themes.light);

  useLayoutEffect(() => {
    if (surface.current === null || !ANNOUNCES_THEME[variant]) {
      return;
    }

    const tokens = readThemeTokens(surface.current, look.fonts);
    const event: ThemeEvent = {
      brandTitle: look.brand,
      brandUrl: look.brandUrl,
      section,
      tokens,
    };

    setTheme(docsTheme(tokens));
    paintPreview(document.documentElement, tokens);
    addons.getChannel().emit(THEME_EVENT, event);
  }, [look, resolved, section, variant]);

  return (
    <div data-theme={look.themeName(resolved)} ref={surface} style={paint(variant, look.fonts)}>
      <style>{look.style}</style>
      {children(theme)}
    </div>
  );
};
