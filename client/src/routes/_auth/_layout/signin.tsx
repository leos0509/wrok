import SigninForm from "@/components/forms/SigninForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/_layout/signin")({
  component: SigninPage,
});

function SigninPage() {
  return (
    <div className="page-container flex items-center justify-center bg-background h-screen">
      <SigninForm />
    </div>
  );
}
