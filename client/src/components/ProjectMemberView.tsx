// import { useParams } from "@tanstack/react-router";

import { useGetProjectMembers } from "@/hooks/useProject";
import type { User } from "@/types/user";
import { useParams } from "@tanstack/react-router";
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
} from "./ui/table";
import { cn } from "@/lib/utils";
import Loading from "./Loading";

const ProjectMemberView = () => {
  const params = useParams({ from: "/dashboard/_layout/projects/$projectId" });
  const {
    data = [] as User[],
    isLoading,
    isError,
  } = useGetProjectMembers(params.projectId, Boolean(params.projectId));

  const columns: ColumnDef<User>[] = [
    {
      id: "name",
      header: "Name",
      cell: ({ row }) => {
        const user = row.original;
        return `${user.firstName} ${user.lastName}`;
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => row.getValue("email"),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => row.getValue("role") || "N/A",
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <div className="py-2 text-red-400">Error loading project members</div>
    );
  }

  return (
    <div className="scrollbar-thin flex max-h-full w-full flex-col gap-4 overflow-y-auto p-1 scrollbar-thumb-gray-400 scrollbar-track-transparent">
      <div className="overflow-hidden rounded-md border">
        <Table className="bg-background text-sm">
          <TableHeader className="bg-secondary text-secondary-foreground">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="font-display font-semibold px-4"
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
                        "font-light px-4",
                        cell.column.id === "description" ? "max-w-32" : "",
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
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
      </div>
    </div>
  );
};

export default ProjectMemberView;
