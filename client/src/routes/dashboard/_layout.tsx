
import AppSidebar from "@/components/AppSidebar";
import { useAppStore } from "@/stores";
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/_layout")({
  component: RouteComponent,
});

function RouteComponent() {
  const isAuthenticated = useAppStore.getState().isAuthenticated;
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate({ to: "/signin" });
  }

  return (
    <div className="relative h-screen w-screen flex overflow-y-auto overflow-x-hidden">
      <AppSidebar />
      <div className="flex-1 min-w-0 p-6 flex flex-col gap-4 items-start justify-start overflow-x-hidden">
        <Outlet />
      </div>
    </div>
  );
}
