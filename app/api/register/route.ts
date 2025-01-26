import { db } from "@/drizzle/index";
import { user } from "@/drizzle/schema";
import { hashPassword } from "@/utils/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return new NextResponse("Missing Fields", { status: 400 });
        }

        const passwordHash = await hashPassword(password);

        await db
            .insert(user)
            .values({
                name, 
                email,
                password: passwordHash,
            });

        return new NextResponse("Success", { status: 200 });
    } catch (error: any) {
        if (error.code === "23505" && error.detail?.includes("Key (email)")) {
            return new NextResponse(
                JSON.stringify({ message: "Email is already in use." }),
                { status: 409, headers: { "Content-Type": "application/json" } }
            );
        }
        console.error("USER_POST: ", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}