"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import Toolbar from "./toolbar";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onUpdate: (data: TData[]) => void;
}

export default function DashboardDataTable<TData, TValue>({
  columns,
  data,
  onUpdate,
}: DataTableProps<TData, TValue>) {
  const { toast } = useToast();
  const [rowSelection, setRowSelection] = useState({});
  const router = useRouter();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  });

  const handleBlock = async () => {
    try {
      const ids = table
        .getSelectedRowModel()
        // @ts-expect-error ignore
        .rows.map((row) => row.original.id);

      if (ids.length) {
        const response = await axios.post("/api/block", { ids });

        toast({
          title: "Success",
          description: response.data.message,
          variant: "default",
        });

        onUpdate(response.data.data);
      } else {
        toast({
          title: "Error",
          description: "No users selected to block.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        // @ts-expect-error ignore
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const handleUnblock = async () => {
    try {
      const ids = table
        .getSelectedRowModel()
        // @ts-expect-error ignore
        .rows.map((row) => row.original.id);

      if (ids.length) {
        const response = await axios.post("/api/unblock", { ids });
        onUpdate(response.data.data);
        toast({
          title: "Success",
          description: response.data.message,
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: "No users selected to unblock.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        // @ts-expect-error ignore
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    try {
      const ids = table
        .getSelectedRowModel()
        // @ts-expect-error ignore
        .rows.map((row) => row.original.id);
      if (ids.length) {
        const response = await axios.post("/api/delete", { ids });
        toast({
          title: "Success",
          description: response.data.message,
          variant: "default",
        });
        router.refresh();
        onUpdate(response.data.data || []);
      } else {
        toast({
          title: "Error",
          description: "No users selected to delete.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        // @ts-expect-error ignore
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };
  return (
    <div className="rounded-md border">
      <Toolbar
        onBlock={handleBlock}
        onUnblock={handleUnblock}
        onDelete={handleDelete}
      />
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table?.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
