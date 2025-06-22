import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type CreateProjectFormValues, createProjectFormSchema, createProjectFormDefaultValues } from "@/schemas/projectSchema";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Loader2Icon } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useCreateProject } from "@/hooks/useProject";
import { useAppStore } from "@/stores";

type CreateProjectDialogProps = {
  trigger: React.ReactNode;
};

const CreateProjectDialog = ({trigger}: CreateProjectDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[80%] min-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>
            Create a new project. You can add tasks, members, and more once the project is created.
          </DialogDescription>
        </DialogHeader>
        <CreateProjectForm setIsOpen={setIsOpen}/>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectDialog;

type CreateProjectFormProps = {
    setIsOpen: (isOpen: boolean) => void;
};

const CreateProjectForm = ({ setIsOpen }: CreateProjectFormProps) => {
    const teamId = useAppStore.getState().currentTeam?.id || "";
    const { mutate, isPending } = useCreateProject();
    const form = useForm<CreateProjectFormValues>({
        resolver: zodResolver(createProjectFormSchema),
        defaultValues: createProjectFormDefaultValues,
    })
    const onSubmit = (data: CreateProjectFormValues) => {
        const payload = {
            name: data.name,
            description: data.description,
            teamId
        }
        mutate(payload, {
            onSuccess: () => {
                setIsOpen(false);
                form.reset();
            }
        })
    };
    return (
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter project name"
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description &#40;Optional&#41;</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter description"
                  {...field}
                  disabled={isPending}
                  className="min-h-32"
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
            <span>Create Project</span>
          )}
        </Button>
      </form>
    </Form>
    )
}