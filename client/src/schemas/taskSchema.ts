import { z } from "zod";

export const createTaskFormSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional(),
  dateRange: z
    .object({
      from: z.date().optional(),
      to: z.date().optional(),
    })
    .optional()
    .refine(
      (data) => {
        if (!data) return true;
        if (!data.from && !data.to) return true;
        if (!data.from || !data.to) {
          return false;
        }
        return data.from <= data.to;
      },
      {
        message: "Start date must be before or equal to end date",
      },
    ),
});

export type CreateTaskFormValues = z.infer<typeof createTaskFormSchema>;

export const createTaskFormDefaultValues: CreateTaskFormValues = {
  title: "",
  description: "",
  dateRange: {
    from: undefined,
    to: undefined,
  },
};