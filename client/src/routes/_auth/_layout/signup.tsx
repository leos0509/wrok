import SignupPage from "@/features/auth/pages/SignupPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/_layout/signup")({
  component: SignupPage,
});
