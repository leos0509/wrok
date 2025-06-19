import { z } from "zod";

export const signinFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export type SigninFormValues = z.infer<typeof signinFormSchema>;

export const signinFormDefaultValues: SigninFormValues = {
  email: "",
  password: "",
};