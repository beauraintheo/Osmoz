import { execCommand } from "./exec-command.ts";
import { APPS_DIR, listApps } from "./list-apps.ts";
import { runApp } from "./run-app.ts";

process.exitCode = runApp(process.argv.slice(2), {
  apps: listApps(APPS_DIR),
  exec: execCommand,
});
