import { createFileRoute } from "@tanstack/react-router";
import type { ReactElement } from "react";

const Home = (): ReactElement => <h1 className="text-2xl font-semibold">Flux</h1>;

export const Route = createFileRoute("/")({ component: Home });
