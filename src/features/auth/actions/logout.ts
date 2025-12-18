"use server";

import { deleteSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function logoutAction(): Promise<void> {
  await deleteSession();
  redirect("/login");
}
