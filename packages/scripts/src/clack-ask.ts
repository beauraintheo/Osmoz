import { isCancel, select } from "@clack/prompts";

export interface AskOption {
  hint?: string;
  label: string;
  value: string;
}

export type Ask = (message: string, options: readonly AskOption[]) => Promise<string | undefined>;

export const clackAsk: Ask = async (message, options) => {
  const answer = await select({ message, options: [...options] });
  return isCancel(answer) ? undefined : answer;
};
