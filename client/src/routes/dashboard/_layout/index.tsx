import DashboardPage from "@/pages/dashboardPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/_layout/")({
  component: DashboardPage,
});
