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

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    onUpdate: (data: TData[]) => void
  }
  
export default function DashboardDataTable<TData, TValue>({
    columns,
    data,
    onUpdate
  }: DataTableProps<TData, TValue>) {

    const [rowSelection, setRowSelection] = useState({});

    const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      onRowSelectionChange: setRowSelection,
      state: {
        rowSelection,
      }
    })

    const handleBlock = async () => {
        try {
            // @ts-ignore
            const ids = table.getSelectedRowModel().rows.map((row) => row.original.id);
            const response = await axios.post("/api/block", {ids});
            onUpdate(response.data.data);
        } catch (error) {
            console.log(error);
        } 
        
    }

    const handleUnblock = async () => {
        try {
            // @ts-ignore
            const ids = table.getSelectedRowModel().rows.map((row) => row.original.id);
            const response = await axios.post("/api/unblock", {ids});
            onUpdate(response.data.data);
        } catch (error) {
            console.log(error);
        } 
    }

    const handleDelete = async () => {
        try {
            // @ts-ignore
            const ids = table.getSelectedRowModel().rows.map((row) => row.original.id);
            const response = await axios.post("/api/delete", {ids});
            onUpdate(response.data.data);
        } catch (error) {
            console.log(error);
        } 
    }
    return (
      <div className="rounded-md border">
        <Toolbar onBlock={handleBlock} onUnblock={handleUnblock} onDelete={handleDelete}/>
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
                            header.getContext()
                          )}
                    </TableHead>
                  )
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
    )
  }
  