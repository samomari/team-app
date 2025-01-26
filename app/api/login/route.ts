import { db } from "@/drizzle/index";
import { user } from "@/drizzle/schema";
import { comparePassword, generateAccessToken } from "@/utils/auth";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { User } from "@/types";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new NextResponse("Missing Fields", { status: 400 });
    }

    const existingUser: User[] = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1)
      .execute();

    if (!existingUser || !existingUser.length) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid credentials" }),
        { status: 401, headers: { "Content-Type": "application/json" } },
      );
    }

    if (existingUser[0].status === "blocked") {
      return new NextResponse(
        JSON.stringify({ message: "This user is blocked" }),
        { status: 401, headers: { "Content-Type": "application/json" } },
      );
    }

    const userRecord = existingUser[0];

    const isPasswordValid = await comparePassword(
      password,
      userRecord.password,
    );
    if (!isPasswordValid) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid credentials" }),
        { status: 401, headers: { "Content-Type": "application/json" } },
      );
    }

    const accessToken = generateAccessToken(userRecord.id);

    await db
      .update(user)
      .set({ lastLogin: new Date(), accessToken })
      .where(eq(user.id, userRecord.id))
      .execute();

    const response = NextResponse.json({ message: "Logged in successfully" });

    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 24 * 30,
    });

    return response;
  } catch (error) {
    console.log("LOGIN_ERROR: ", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
