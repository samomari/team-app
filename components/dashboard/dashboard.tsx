"use client";
import { 
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter
 } from "@/components/ui/card";
import Toolbar from "./toolbar";
import { useEffect, useState } from "react";
import axios from "axios";
import DashboardDataTable from "./dashboard-data";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";
  

export type User = {
    id: string
    status: "active" | "blocked" 
    email: string
    passwrord: string
    accessToken: string
    lastLogin: Date
    createdAt: Date
  }

  export const columns: ColumnDef<User>[] = [
    {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "email",
        header: "Email",
      },
    {
      accessorKey: "status",
      header: "Status",
    },
    
    {
      accessorKey: "lastLogin",
      header: "Last Seen",
    },
  ]

  
export default function Dashboard () {
    const [data, setData] = useState<User[]>([]);
    useEffect(() => {
        axios.get("/api/user").then((res) => setData(res.data.data));
    },[]);
    return (
        <div className="flex items-center justify-center">
            <Card className="lg:w-8/12 w-full shadow-md mt-20 p-8">
                    <DashboardDataTable columns={columns} data={data} onUpdate={setData}/>
            </Card>
        </div>    
    );
}
