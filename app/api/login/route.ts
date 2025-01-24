import { db } from "@/drizzle/index";
import { user } from "@/drizzle/schema";
import { comparePassword, generateAccessToken, generateRefreshToken } from "@/utils/auth";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return new NextResponse("Missing Fields", { status: 400 });
        }

        const existingUser = await db
            .select()
            .from(user)
            .where(eq(user.email, email))
            .limit(1)
            .execute();

        if (!existingUser || !existingUser.length) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid credentials" }),
                { status: 401, headers: { "Content-Type": "application/json" } }
            );
        }

        const userRecord = existingUser[0];

        const isPasswordValid = await comparePassword(password, userRecord.password);
        if (!isPasswordValid) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid credentials" }),
                { status: 401, headers: { "Content-Type": "application/json" } }
            );
        }

        const accessToken = generateAccessToken(userRecord.id);
        const refreshToken = generateRefreshToken(userRecord.id);

        const headers = new Headers();
        headers.set('Set-Cookie', `refreshToken=${refreshToken}; HttpOnly; Secure; Path=/; SameSite=Strict`);

        return new NextResponse(
            JSON.stringify({ accessToken }),
            { status: 200, headers }
        );

    } catch (error: any) {
        console.log("LOGIN_ERROR", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}