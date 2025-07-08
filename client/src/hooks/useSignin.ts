import { setToken } from "@/lib/utils";
import { signin } from "@/services/authServices";
import { useAppStore } from "@/stores";
import type { SigninPayload } from "@/types/auth.types";
import type { ErrorResponse } from "@/types/global.types";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import type { AxiosError } from "axios";
import { toast } from "sonner";

export const useSignin = () => {
  const navigate = useNavigate();
  
  const setUser = useAppStore().setUser
  return useMutation({
    mutationKey: ["signin"],
    mutationFn: async ({ email, password }: SigninPayload) =>
      await signin({ email, password }),

    onSuccess: (response) => {
      const { data: signinData, message } = response.data;
      setToken(signinData.token);
      setUser(signinData.user)
      navigate({ to: "/dashboard" });
      toast.success(message || "Sign-in successful!");
    },

    onError: (error: AxiosError<ErrorResponse>) => {
      const message = error.response?.data?.message || "Sign-in failed. Please try again.";
      toast.error(message);
      console.error("Sign-in error:", error);
    },
  });
};
