import { z } from "zod";

export const createProjectFormSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional()
});

export type CreateProjectFormValues = z.infer<typeof createProjectFormSchema>;

export const createProjectFormDefaultValues: CreateProjectFormValues = {
  name: "",
  description: ""
};