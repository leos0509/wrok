import { cn, priorityMapping, statusMapping } from "@/lib/utils";
import type { Task, TaskPriority, TaskStatus } from "@/types/task";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { format } from "date-fns";
import type { User } from "@/types/user";
import AssigneesInput from "../AssigneesInput";
import PriorityIcon from "../PriorityIcon";

const ColumnTaskTable = ({ tasks }: { tasks: Task[] }) => {
  const columns: ColumnDef<Task>[] = [
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const status = getValue() as TaskStatus | undefined | null;
        return status ? (
          <span className="line-clamp-1 text-wrap">
            {statusMapping(status)}
          </span>
        ) : (
          <span className="text-muted-foreground">N/A</span>
        );
      },
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ getValue }) => {
        const priority = getValue() as TaskPriority | undefined | null;
        return priority ? (
          <div className="flex items-center gap-1">
            <PriorityIcon priority={priority} />
            <span className="line-clamp-1 text-wrap">
              {priorityMapping(priority)}
            </span>
          </div>
        ) : (
          <span className="text-muted-foreground">N/A</span>
        );
      },
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
      cell: ({ getValue }) => {
        const date = getValue() as Date | null;
        return date ? (
          format(new Date(date), "MMM dd, yyyy")
        ) : (
          <span className="text-muted-foreground">N/A</span>
        );
      },
    },
    {
      accessorKey: "dueDate",
      header: "End Date",
      cell: ({ getValue }) => {
        const date = getValue() as Date | null;
        return date ? (
          format(new Date(date), "MMM dd, yyyy")
        ) : (
          <span className="text-muted-foreground">N/A</span>
        );
      },
    },
    {
      accessorKey: "assignees",
      header: "Assignees",
      cell: ({ getValue }) => {
        const assignees = getValue() as User[];
        return assignees && assignees.length > 0 ? (
          <AssigneesInput assignees={assignees} />
        ) : (
          <span className="text-muted-foreground">None</span>
        );
      },
    },
  ];

  const table = useReactTable({
    data: tasks,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <Table className="bg-background text-xs">
      <TableHeader className="bg-secondary text-secondary-foreground">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                className="font-display font-semibold lg:px-4"
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.length > 0 ? (
          table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  className={cn(
                    "font-light lg:px-4",
                    cell.column.id === "description" ? "max-w-32" : "",
                  )}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="text-center">
              No tasks found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default ColumnTaskTable;
