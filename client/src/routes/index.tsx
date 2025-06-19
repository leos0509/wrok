import NavBar from "@/components/NavBar";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="h-screen w-screen overflow-y-auto relative">
      <NavBar />
      <div className="h-full w-full flex items-center justify-center">
        <h1>Hello World!</h1>
      </div>
    </div>
  );
}
