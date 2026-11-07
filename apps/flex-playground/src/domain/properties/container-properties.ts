import { keywordProperty } from "@/domain/property-kinds/keyword-property";
import { numberProperty } from "@/domain/property-kinds/number-property";

export const CONTAINER_PROPERTIES = {
  "align-content": keywordProperty({
    initial: "normal",
    values: [
      "normal",
      "flex-start",
      "flex-end",
      "center",
      "space-between",
      "space-around",
      "space-evenly",
      "stretch",
    ],
  }),
  "align-items": keywordProperty({
    initial: "normal",
    values: ["normal", "stretch", "flex-start", "flex-end", "center", "baseline", "start", "end"],
  }),
  "column-gap": numberProperty({
    initial: 0,
    max: 48,
    min: 0,
    step: 1,
  }),
  display: keywordProperty({
    initial: "flex",
    values: ["flex", "inline-flex"],
  }),
  "flex-direction": keywordProperty({
    initial: "row",
    values: ["row", "row-reverse", "column", "column-reverse"],
  }),
  "flex-wrap": keywordProperty({
    initial: "nowrap",
    values: ["nowrap", "wrap", "wrap-reverse"],
  }),
  "justify-content": keywordProperty({
    initial: "normal",
    values: [
      "normal",
      "flex-start",
      "flex-end",
      "center",
      "space-between",
      "space-around",
      "space-evenly",
      "start",
      "end",
    ],
  }),
  "row-gap": numberProperty({
    initial: 0,
    max: 48,
    min: 0,
    step: 1,
  }),
};
