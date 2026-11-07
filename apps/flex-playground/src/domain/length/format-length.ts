import type { Length } from "./parse-length";

export const formatLength = ({ amount, unit }: Length): string => `${amount}${unit ?? ""}`;
