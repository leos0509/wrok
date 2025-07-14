import { z } from 'zod';

export const teamFormSchema = z.object({
    name: z.string().min(1, "Team name is required"),
});

export type TeamFormValues = z.infer<typeof teamFormSchema>;

export const teamFormDefaultValues: TeamFormValues = {
    name: "",
};

export const addMemberFormSchema = z.object({
    email: z.string().email("Invalid email address").min(1, "Email is required"),
});

export type AddMemberFormValues = z.infer<typeof addMemberFormSchema>;

export const addMemberFormDefaultValues: AddMemberFormValues = {
    email: "",
};