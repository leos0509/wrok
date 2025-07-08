import SignupForm from "@/components/forms/SignupForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/_layout/signup")({
  component: SignupPage,
});

function SignupPage() {
  return (
    <div className="page-container flex h-screen items-center justify-center bg-background">
      <SignupForm />
    </div>
  );
}
