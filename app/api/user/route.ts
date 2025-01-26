import { db } from "@/drizzle/index";
import { user } from "@/drizzle/schema";
import { desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {
    try {
        const accessToken =  req.cookies.get("accessToken");

        if (!accessToken) {
            return NextResponse.redirect(new URL("/auth", req.nextUrl));
        }

        const data = await db
            .select({ id: user.id, name: user.name, email: user.email , status: user.status , lastLogin: user.lastLogin})
            .from(user)
            .orderBy(desc(user.lastLogin));

        return NextResponse.json({data});

    } catch (error) {
        console.log("GET_USER: ", error);
    }
}
