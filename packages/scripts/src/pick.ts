import { cancel, intro } from "@clack/prompts";

import { clackAsk } from "./clack-ask.ts";
import { execCommand } from "./exec-command.ts";
import { APPS_DIR, listApps } from "./list-apps.ts";
import { pickCommand } from "./pick-command.ts";

intro("Osmoz");

process.exitCode = await pickCommand({
  apps: listApps(APPS_DIR),
  ask: clackAsk,
  exec: execCommand,
  onCancel: () => cancel("Nothing was run."),
});
