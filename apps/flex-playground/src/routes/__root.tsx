import { createRootRoute, Outlet } from "@tanstack/react-router";
import type { ReactElement } from "react";

import { Header } from "@/components/header";

const RootLayout = (): ReactElement => (
  <div className="flex min-h-dvh flex-col lg:h-dvh">
    <Header />

    <main className="flex flex-1 flex-col lg:min-h-0 lg:overflow-y-auto">
      <Outlet />
    </main>
  </div>
);

export const Route = createRootRoute({ component: RootLayout });
