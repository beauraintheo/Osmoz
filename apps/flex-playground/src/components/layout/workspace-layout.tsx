import type { ReactElement, ReactNode } from "react";

interface WorkspaceLayoutProps {
  canvas?: ReactNode;
  canvasLabel: string;
  controls?: ReactNode;
  controlsLabel: string;
  panel?: ReactNode;
  panelLabel: string;
}

export const WorkspaceLayout = ({
  canvas,
  canvasLabel,
  controls,
  controlsLabel,
  panel,
  panelLabel,
}: WorkspaceLayoutProps): ReactElement => (
  <div className="flex flex-1 flex-col lg:min-h-0 lg:flex-row">
    <aside
      aria-label={controlsLabel}
      className="min-h-48 border-b border-border bg-card lg:min-h-0 lg:w-90 lg:shrink-0 lg:border-r lg:border-b-0"
    >
      {controls}
    </aside>

    <section
      aria-label={canvasLabel}
      className="order-first h-70 shrink-0 border-b border-border lg:order-0 lg:h-auto lg:min-w-0 lg:flex-1 lg:border-b-0"
    >
      {canvas}
    </section>

    <aside
      aria-label={panelLabel}
      className="min-h-48 flex-1 border-border bg-card lg:min-h-0 lg:w-100 lg:flex-none lg:shrink-0 lg:border-l"
    >
      {panel}
    </aside>
  </div>
);
