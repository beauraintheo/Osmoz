import { keywordProperty } from "@/domain/property-kinds/keyword-property";
import { lengthProperty } from "@/domain/property-kinds/length-property";
import { numberOrKeywordProperty } from "@/domain/property-kinds/number-or-keyword-property";
import { numberProperty } from "@/domain/property-kinds/number-property";
import { textProperty } from "@/domain/property-kinds/text-property";

export const ITEM_PROPERTIES = {
  "align-self": keywordProperty({
    initial: "auto",
    values: ["auto", "stretch", "flex-start", "flex-end", "center", "baseline"],
  }),
  content: textProperty({ initial: "", maxCharacters: 40 }),
  "flex-basis": lengthProperty({ initial: "auto", keywords: ["auto", "content"] }),
  "flex-grow": numberProperty({
    initial: 0,
    max: 99,
    min: 0,
    step: 0.1,
  }),
  "flex-shrink": numberProperty({
    initial: 1,
    max: 99,
    min: 0,
    step: 0.1,
  }),
  "font-size": numberOrKeywordProperty({
    initial: "inherit",
    keywords: ["inherit"],
    max: 48,
    min: 8,
    step: 1,
  }),
  height: lengthProperty({ initial: "auto", keywords: ["auto"] }),
  order: numberProperty({
    initial: 0,
    max: 99,
    min: -99,
    step: 1,
  }),
  width: lengthProperty({ initial: "auto", keywords: ["auto"] }),
};
