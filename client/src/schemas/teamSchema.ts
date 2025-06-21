import { z } from 'zod';

export const teamFormSchema = z.object({
    name: z.string().min(1, "Team name is required"),
});

export type TeamFormValues = z.infer<typeof teamFormSchema>;

export const teamFormDefaultValues: TeamFormValues = {
    name: "",
};