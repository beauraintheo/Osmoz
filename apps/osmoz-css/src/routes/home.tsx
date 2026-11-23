import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: (): never => {
    throw redirect({ to: "/flexbox" });
  },
});
