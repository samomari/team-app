import { db } from "@/drizzle";
import { user } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("accessToken")?.value || "";

    await db
      .update(user)
      .set({ accessToken: "" })
      .where(eq(user.accessToken, token)).execute;

    const response = NextResponse.json({ message: "Success" });
    response.cookies.delete("accessToken");
    return response;
  } catch (error) {
    console.log(error);
  }
}
