"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import axios from "axios";

export default function HeaderMenu() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            const response = await axios.post("/api/logout");

            if (response.status === 200) {
                router.push("/auth");
            }
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <div className="w-full flex items-center justify-end px-4 py-2">
            <Button onClick={handleLogout} variant="outline" className="flex items-center space-x-2 text-blue-600">
                <LogOut className="w-4 h-4" />
                Logout
            </Button>
        </div>
  );
}
