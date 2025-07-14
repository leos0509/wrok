import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  addMemberFormDefaultValues,
  addMemberFormSchema,
  type AddMemberFormValues,
} from "@/schemas/teamSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useAddMemberToProject } from "@/hooks/useProject";
import { useParams } from "@tanstack/react-router";
import { useState } from "react";

type AddMemberDialogProps = {
  children: React.ReactNode;
};

const AddMemberDialog = ({ children }: AddMemberDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[80%] min-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Add Member
          </DialogTitle>
          <DialogDescription>
            Invite a new member to the project by entering their email address.
          </DialogDescription>
        </DialogHeader>
        <div className="w-full">
          <AddMemberForm onClose={() => setIsOpen(false)}/>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberDialog;

type AddMemberFormProps = {
  onClose: () => void;
};

const AddMemberForm = ({onClose}: AddMemberFormProps) => {
  const projectId = useParams({
    from: "/dashboard/_layout/projects/$projectId",
  }).projectId;

  const form = useForm<AddMemberFormValues>({
    defaultValues: addMemberFormDefaultValues,
    resolver: zodResolver(addMemberFormSchema),
  });
  const { mutate } = useAddMemberToProject();

  const onSubmit = (data: AddMemberFormValues) => {
    mutate({
      projectId,
      email: data.email,
    }, {
      onSuccess: () => {
        form.reset();
        if (onClose) onClose();
      },
    });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter member's email"
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-4 flex justify-end">
          <Button variant="default" type="submit">
            Invite Member
          </Button>
        </div>
      </form>
    </Form>
  );
};
