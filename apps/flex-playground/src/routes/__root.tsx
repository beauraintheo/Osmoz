import { createRootRoute, Outlet } from "@tanstack/react-router";
import type { ReactElement } from "react";

import { AppShell } from "@/components/layout/app-shell";

const RootLayout = (): ReactElement => (
  <AppShell>
    <Outlet />
  </AppShell>
);

export const Route = createRootRoute({ component: RootLayout });
