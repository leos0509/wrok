import { useAppStore } from "@/stores";
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/_layout")({
  component: RouteComponent,
});

function RouteComponent() {
  const isAuthenticated = useAppStore.getState().isAuthenticated;
  const signout = useAppStore.getState().signout;
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate({ to: "/signin" });
  }

  const handleSingout = () => {
    signout();
    toast.success("Signout successful!");
    navigate({ to: "/signin" });
  }

  return (
    <div className="relative h-screen w-screen">
      <h1>Dashboard Layout</h1>
      <div>
        <button
          className="rounded bg-blue-500 p-2 text-white hover:bg-blue-600"
          onClick={handleSingout}
        >
          Signout
        </button>
      </div>
      <Outlet />
    </div>
  );
}
