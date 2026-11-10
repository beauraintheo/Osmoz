import { z } from "zod";

import type { KeywordSchema, Keywords } from "./keyword-property";
import { rangedNumber, type NumberRange } from "./number-range";

interface NumberOrKeywordOptions<Values extends Keywords> extends NumberRange {
  initial: Values[number] | number;
  keywords: Values;
}

type NumberOrKeywordProperty<Values extends Keywords> = z.ZodDefault<
  z.ZodUnion<readonly [KeywordSchema<Values>, z.ZodNumber]>
> & {
  initial: Values[number] | number;
  keywords: Values;
  kind: "number-or-keyword";
  range: NumberRange;
};

export const numberOrKeywordProperty = <const Values extends Keywords>({
  initial,
  keywords,
  ...range
}: NumberOrKeywordOptions<Values>): NumberOrKeywordProperty<Values> =>
  Object.assign(z.union([z.enum(keywords), rangedNumber(range)]).default(initial), {
    initial,
    keywords,
    kind: "number-or-keyword" as const,
    range,
  });
