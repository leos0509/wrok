import PageHeader from "@/components/PageHeader";
import { createFileRoute } from "@tanstack/react-router";


export const Route = createFileRoute("/dashboard/_layout/")({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <div className="h-full w-full">
      <PageHeader
        title="Dashboard"
        description="Welcome to your dashboard! Here you can manage your projects, view analytics, and more."
      />
      <div className="px-4 py-2">Dashboard Homepage</div>
    </div>
  );
};
