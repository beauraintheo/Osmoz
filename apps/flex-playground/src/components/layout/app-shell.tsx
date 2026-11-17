import type { PropsWithChildren, ReactElement } from "react";

import { Header } from "./header";

export const AppShell = ({ children }: PropsWithChildren): ReactElement => (
  <div className="flex min-h-dvh flex-col lg:h-dvh">
    <Header />

    <main className="flex flex-1 flex-col lg:min-h-0 lg:overflow-y-auto">{children}</main>
  </div>
);
