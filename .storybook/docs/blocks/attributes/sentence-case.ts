const isAcronym = (word: string): boolean => word.length > 1 && word === word.toUpperCase();

export const sentenceCase = (name: string): string =>
  name
    .split(" ")
    .map((word, position) => (position === 0 || isAcronym(word) ? word : word.toLowerCase()))
    .join(" ");
