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
    <div className="relative flex h-screen w-screen overflow-hidden">
      <AppSidebar />
      <Outlet />
    </div>
  );
}
