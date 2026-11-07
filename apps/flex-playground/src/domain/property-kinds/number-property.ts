import type { z } from "zod";

import { rangedNumber, type NumberRange } from "./number-range";

interface NumberOptions extends NumberRange {
  initial: number;
}

type NumberProperty = z.ZodDefault<z.ZodNumber> & {
  initial: number;
  kind: "number";
  range: NumberRange;
};

export const numberProperty = ({ initial, ...range }: NumberOptions): NumberProperty =>
  Object.assign(rangedNumber(range).default(initial), {
    initial,
    kind: "number" as const,
    range,
  });
