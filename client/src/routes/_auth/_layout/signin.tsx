import SigninPage from "@/features/auth/pages/SigninPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/_layout/signin")({
  component: SigninPage,
});
