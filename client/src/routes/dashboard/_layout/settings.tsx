import PageHeader from "@/components/PageHeader";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/_layout/settings")({
  component: SettingPage,
});

function SettingPage() {
  return (
    <div className="h-full w-full">
      <PageHeader
        title="Settings"
        description="Manage your account settings, preferences, and more."
      />
      <div className="px-4 py-2">SettingPage</div>
    </div>
  );
}
