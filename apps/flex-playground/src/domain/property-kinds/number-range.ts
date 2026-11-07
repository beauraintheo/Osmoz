import { z } from "zod";

export interface NumberRange {
  max: number;
  min: number;
  step: number;
}

export const rangedNumber = ({ max, min, step }: NumberRange): z.ZodNumber =>
  z.number().min(min).max(max).multipleOf(step);

export const fitNumber = (value: number, { max, min, step }: NumberRange): number => {
  const stepsPerUnit = 1 / step;
  const bounded = Math.min(max, Math.max(min, value));

  return Math.round(bounded * stepsPerUnit) / stepsPerUnit + 0;
};
