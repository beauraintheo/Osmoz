import { OsmozSymbol } from "@osmoz/brand/osmoz-symbol";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

interface BrandTitleTexts {
  mono: boolean;
  name: string;
  tagline: string;
}

export const brandTitle = ({ mono, name, tagline }: BrandTitleTexts): string =>
  renderToStaticMarkup(
    createElement(
      "span",
      { className: "osmoz-brand" },
      createElement(OsmozSymbol, { className: "osmoz-brand-symbol" }),
      createElement(
        "span",
        { className: "osmoz-brand-texts" },
        createElement(
          "span",
          { className: mono ? "osmoz-brand-name osmoz-brand-name-mono" : "osmoz-brand-name" },
          name,
        ),
        createElement("span", { className: "osmoz-brand-tagline" }, tagline),
      ),
    ),
  );
