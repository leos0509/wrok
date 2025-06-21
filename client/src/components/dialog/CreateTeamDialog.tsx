import { useCreateTeam } from "@/hooks/useTeam";
import {
  teamFormDefaultValues,
  teamFormSchema,
  type TeamFormValues,
} from "@/schemas/teamSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";

type CreateTeamDigalogProps = {
  trigger: React.ReactNode;
};

const CreateTeamDialog = ({ trigger }: CreateTeamDigalogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[80%] min-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Team</DialogTitle>
          <DialogDescription>
            Create a new team to collaborate with others.
          </DialogDescription>
        </DialogHeader>
        <CreateTeamForm setIsOpen={setIsOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateTeamDialog;

type CreateTeamFormProps = {
  setIsOpen: (isOpen: boolean) => void;
};

const CreateTeamForm = ({ setIsOpen }: CreateTeamFormProps) => {
  const { mutate, isPending } = useCreateTeam();

  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: teamFormDefaultValues,
  });

  const onSubmit = (data: TeamFormValues) => {
    console.log("CreateTeamForm onSubmit data:", data);
    mutate(data.name, {
      onSuccess: () => {
        form.reset();
        setIsOpen(false);
      },
    });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter team name"
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isPending}
          className="mt-4 w-full font-display"
        >
          {isPending ? (
            <>
              <Loader2Icon className="size-4 animate-spin" />
              <span>Creating...</span>
            </>
          ) : (
            <span>Create Team</span>
          )}
        </Button>
      </form>
    </Form>
  );
};
