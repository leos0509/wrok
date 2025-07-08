import { signup } from "@/services/authServices";
import type { SignupPayload } from "@/types/auth.types";
import type { ErrorResponse } from "@/types/global.types";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import type { AxiosError } from "axios";
import { toast } from "sonner";

export const useSignup = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ["signup"],
    mutationFn: async ({
      email,
      password,
      firstName,
      lastName,
    }: SignupPayload) => await signup({ email, password, firstName, lastName }),

    onSuccess: (response) => {
      const { message } = response.data;
      navigate({ to: "/signin" });
      toast.success(message || "Sign-up successful!");
    },

    onError: (error: AxiosError<ErrorResponse>) => {
      const message =
        error.response?.data?.message || "Sign-up failed. Please try again.";
      toast.error(message);
      console.error("Sign-up error:", error);
    },
  });
};
