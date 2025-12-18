"use server";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import type { User } from "../types";
import { eq } from "drizzle-orm";

export async function getCurrentUser(): Promise<User | null> {
  try {
    const session = await getSession();

    if (!session) {
      return null;
    }

    const [user] = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
      })
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1);

    return user || null;
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
}
