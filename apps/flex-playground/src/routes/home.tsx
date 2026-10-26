import { createFileRoute } from "@tanstack/react-router";
import type { ReactElement } from "react";

const Home = (): ReactElement => (
  <div className="flex flex-1 flex-col lg:min-h-0 lg:flex-row">
    <aside
      aria-label="Contrôles"
      className="min-h-48 border-b border-border bg-card lg:min-h-0 lg:w-90 lg:shrink-0 lg:border-r lg:border-b-0"
    />

    <section
      aria-label="Canvas"
      className="order-first h-70 shrink-0 border-b border-border lg:order-0 lg:h-auto lg:min-w-0 lg:flex-1 lg:border-b-0"
    />

    <aside
      aria-label="Code généré"
      className="min-h-48 flex-1 border-border bg-card lg:min-h-0 lg:w-100 lg:flex-none lg:shrink-0 lg:border-l"
    />
  </div>
);

export const Route = createFileRoute("/")({ component: Home });
