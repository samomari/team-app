import { db } from "@/drizzle/index";
import { user } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function checkUserStatus(accessToken: string) {
  const requestingUser = await db
    .select()
    .from(user)
    .where(eq(user.accessToken, accessToken))
    .limit(1)
    .execute();

  if (!requestingUser.length || requestingUser[0].status === "blocked") {
    return true;
  }

  return false;
}
