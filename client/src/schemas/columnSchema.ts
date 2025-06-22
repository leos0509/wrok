import { z } from "zod";

export const createColumnFormSchema = z.object({
  name: z.string().min(1, "Column name is required"),
  description: z.string().optional(),
  color: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^#([0-9A-F]{3}){1,2}$/i.test(val),
      "Color must be a valid hex code",
    ),
});

export type CreateColumnFormValues = z.infer<typeof createColumnFormSchema>;

export const createColumnFormDefaultValues: CreateColumnFormValues = {
  name: "",
  description: "",
  color: "",
};
