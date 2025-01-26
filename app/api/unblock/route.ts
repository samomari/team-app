import { db } from "@/drizzle/index";
import { user } from "@/drizzle/schema";
import { checkUserStatus } from "@/utils/checkUserStatus";
import { inArray } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { desc } from "drizzle-orm";
export async function POST(req: NextRequest) {
  try {
    const accessToken = req.cookies.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.redirect(new URL("/auth", req.nextUrl));
    }

    const isBlocked = await checkUserStatus(accessToken);
    if (isBlocked) {
      return NextResponse.json(
        { message: "You are blocked." },
        { status: 400 },
      );
    }

    const values = await req.json();

    if (!values.ids || values.ids.length === 0) {
      return NextResponse.json(
        { message: "No users selected to unblock." },
        { status: 400 },
      );
    }

    const usersToUnblock = await db
      .select()
      .from(user)
      .where(inArray(user.id, values.ids));

    const notBlockedUsers = usersToUnblock.filter((u) => u.status === "active");

    if (notBlockedUsers.length === usersToUnblock.length) {
      return NextResponse.json(
        { message: "All selected users are already active." },
        { status: 400 },
      );
    }

    await db
      .update(user)
      .set({ status: "active" })
      .where(inArray(user.id, values.ids))
      .returning({
        id: user.id,
        name: user.name,
        email: user.email,
        status: user.status,
        lastLogin: user.lastLogin,
      });

    const data = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        status: user.status,
        lastLogin: user.lastLogin,
      })
      .from(user)
      .orderBy(desc(user.lastLogin));

    return NextResponse.json({
      message: "Selected users unblocked successfully",
      data,
    });
  } catch (error) {
    console.log("GET_USER: ", error);
  }
}
