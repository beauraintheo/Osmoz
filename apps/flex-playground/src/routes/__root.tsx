import { createRootRoute, Outlet } from "@tanstack/react-router";
import type { ReactElement } from "react";

const RootLayout = (): ReactElement => (
  <main className="min-h-dvh p-8">
    <Outlet />
  </main>
);

export const Route = createRootRoute({ component: RootLayout });
