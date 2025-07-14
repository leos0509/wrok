import { cn } from "@/lib/utils";
import type { Task } from "@/types/task";
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

const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ getValue }) => {
      const description = getValue() as string | null;
      return description ? (
        <span className="line-clamp-1 text-wrap">{description}</span>
      ) : (
        <span className="text-muted-foreground">No description</span>
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
      const assignees = getValue() as string[] | null;
      return assignees && assignees.length > 0 ? (
        assignees.join(", ")
      ) : (
        <span className="text-muted-foreground">None</span>
      );
    },
  },
];

const ColumnTaskTable = ({ tasks }: { tasks: Task[] }) => {
  const table = useReactTable({
    data: tasks,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <Table className="bg-background">
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id} className="font-display font-semibold">
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
                    "font-light",
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
