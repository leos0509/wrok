import SigninPage from "@/pages/signinPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/_layout/signin")({
  component: SigninPage,
});
