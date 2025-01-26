import { db } from "@/drizzle/index";
import { user } from "@/drizzle/schema";
import { inArray, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
    try {
        const accessToken =  req.cookies.get("accessToken");

        if (!accessToken) {
            return NextResponse.redirect(new URL("/auth", req.nextUrl));
        }

        const values  = await req.json();

        const data = await db
            .update(user)
            .set({ status: "blocked" })
            .where(inArray(user.id, values.ids))
            .returning({ id: user.id, name: user.name, email: user.email, status: user.status, lastLogin: user.lastLogin });

        return NextResponse.json({data});

    } catch (error) {
        console.log("GET_USER: ", error);
    }
}
