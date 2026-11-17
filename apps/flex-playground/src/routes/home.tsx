import { createFileRoute } from "@tanstack/react-router";
import type { ReactElement } from "react";

import { WorkspaceLayout } from "@/components/layout/workspace-layout";
import { useMessages } from "@/i18n/use-messages";

const Home = (): ReactElement => {
  const messages = useMessages();

  return (
    <WorkspaceLayout
      canvasLabel={messages.playground.canvas}
      controlsLabel={messages.playground.controls}
      panelLabel={messages.playground.code}
    />
  );
};

export const Route = createFileRoute("/")({ component: Home });
