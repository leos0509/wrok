import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/_layout")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="relative h-screen w-screen">
      <h1>Dashboard Layout</h1>
      <Outlet />
    </div>
  );
}
