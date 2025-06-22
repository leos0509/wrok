import { useCreateColumn } from "@/hooks/useColumn";
import {
  createColumnFormDefaultValues,
  createColumnFormSchema,
  type CreateColumnFormValues,
} from "@/schemas/columnSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "@tanstack/react-router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
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
import { Button } from "../ui/button";
import { Loader2Icon } from "lucide-react";
import { Textarea } from "../ui/textarea";
import ColorSelect from "../ColorSelect";

type CreateProjectFormProps = {
  trigger: React.ReactNode;
};

const CreateColumnDialog = ({ trigger }: CreateProjectFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[80%] min-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Column</DialogTitle>
          <DialogDescription>Create a new column.</DialogDescription>
        </DialogHeader>
        <CreateColumnForm setIsOpen={setIsOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateColumnDialog;

type CreateColumnFormProps = {
  setIsOpen: (isOpen: boolean) => void;
};

const CreateColumnForm = ({ setIsOpen }: CreateColumnFormProps) => {
  const params = useParams({ from: "/dashboard/_layout/projects/$projectId" });
  const { mutate, isPending } = useCreateColumn();
  const form = useForm<CreateColumnFormValues>({
    resolver: zodResolver(createColumnFormSchema),
    defaultValues: createColumnFormDefaultValues,
  });

  const onSubmit = (data: CreateColumnFormValues) => {
    const payload = {
      name: data.name,
      description: data.description,
      color: data.color,
      projectId: params.projectId || "",
    };
    mutate(payload, {
      onSuccess: () => {
        setIsOpen(false);
        form.reset();
      },
    });
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-5 gap-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="col-span-4">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} type="text" placeholder="Column Name" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel>Color &#40;Optional&#41;</FormLabel>
              <FormControl>
                <ColorSelect value={field.value} onChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="col-span-5">
              <FormLabel>Description &#40;Optional&#41;</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Column Description"
                  className="min-h-32"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isPending}
          className="col-span-5 mt-4 font-display"
        >
          {isPending ? (
            <>
              <Loader2Icon className="size-4 animate-spin" />
              <span>Creating...</span>
            </>
          ) : (
            <span>Create Column</span>
          )}
        </Button>
      </form>
    </Form>
  );
};
