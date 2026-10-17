import { spawnSync } from "node:child_process";

import type { Command } from "./app-commands.ts";

export const execCommand = ({ command, args }: Command): number => {
  process.stdout.write(`\n› ${[command, ...args].join(" ")}\n`);
  const result = spawnSync(command, args, { stdio: "inherit" });

  if (result.error !== undefined) {
    console.error(`Cannot run "${command}": ${result.error.message}`);
    return 1;
  }

  return result.status ?? 1;
};
