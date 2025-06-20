import type {
  SigninPayload,
  SigninResponse,
  SignupPayload,
  SignupResponse,
} from "@/types/auth.types";
import { axiosClient as axios } from "../lib/axios";

export const signin = async ({
  email,
  password,
}: SigninPayload): Promise<{data: SigninResponse}> => {
  try {
    const res = await axios.post("/auth/signin", { email, password });
    return res;
  } catch (error) {
    console.error("Error during sign-in:", error);
    throw error;
  }
};

export const signup = async ({
  email,
  password,
  firstName,
  lastName,
}: SignupPayload): Promise<{data: SignupResponse}>  => {
  try {
    const res = await axios.post("/auth/signup", {
      email,
      password,
      firstName,
      lastName,
    });
    return res;
  } catch (error) {
    console.error("Error during sign-up:", error);
    throw error;
  }
};