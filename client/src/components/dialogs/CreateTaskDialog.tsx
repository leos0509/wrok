import { useCreateTask } from "@/hooks/useTask";
import {
  createTaskFormDefaultValues,
  createTaskFormSchema,
  type CreateTaskFormValues,
} from "@/schemas/taskSchema";
import type { CreateTaskPayload } from "@/types/task";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatISO } from "date-fns";
import { Loader2Icon } from "lucide-react";
import type React from "react";
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import type { DateRange } from "react-day-picker";
import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import DatePickerInput from "../DatePickerInput";

const CreateTaskDialog = ({
  children,
  columnId,
}: {
  children: React.ReactNode;
  columnId: string;
}) => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[80%] min-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
          <DialogDescription>
            Create a new task for your project. Fill in the details below to get
            started.
          </DialogDescription>
        </DialogHeader>
        <CreateTaskForm columnId={columnId} onClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskDialog;

type CreateTaskFormProps = {
  columnId: string;
  onClose?: () => void;
};

const CreateTaskForm = ({ columnId, onClose }: CreateTaskFormProps) => {
  const { mutate: createTask, isPending } = useCreateTask();
  const form = useForm<CreateTaskFormValues>({
    resolver: zodResolver(createTaskFormSchema),
    defaultValues: createTaskFormDefaultValues,
  });
  const projectId =
    useParams({ from: "/dashboard/_layout/projects/$projectId" }).projectId ||
    "";

  const handleSubmit = (data: CreateTaskFormValues) => {
    const startDate = data.dateRange?.from;
    const dueDate = data.dateRange?.to;
    const payload: CreateTaskPayload = {
      columnId,
      projectId,
      title: data.title,
      description: data.description,
      startDate: startDate
        ? formatISO(startDate, { representation: "date" })
        : "",
      dueDate: dueDate ? formatISO(dueDate, { representation: "date" }) : "",
    };
    createTask(payload, {
      onSuccess: () => {
        form.reset();
        if (onClose) {
          onClose();
        }
      },
      onError: (error) => {
        console.error("Error creating task:", error);
      },
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="grid grid-cols-5 gap-4"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="col-span-5">
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} type="text" placeholder="Enter title ..." />
              </FormControl>
              <FormMessage />
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
                  placeholder="Enter description ..."
                  className="min-h-32"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dateRange"
          render={({ field }) => (
            <FormItem className="col-span-5">
              <FormLabel>Select Time Range &#40;Optional&#41;</FormLabel>
              <FormControl>
                <DatePickerInput
                  value={field.value as DateRange | undefined}
                  onChange={(range: DateRange | undefined | null) => {
                    field.onChange(range);
                  }}
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
            <span>Create Task</span>
          )}
        </Button>
      </form>
    </Form>
  );
};
