import { createThemeStore } from "@osmoz/theme/create-theme-store";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { routeTree } from "@/route-tree.gen";
import { THEME_OPTIONS } from "@/theme-options";

import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";

import "@/theme.css";

createThemeStore(THEME_OPTIONS);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.querySelector("#root");

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  );
}
