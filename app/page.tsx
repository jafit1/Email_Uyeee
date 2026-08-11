import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function Home() {
  const user = await currentUser();
  if (!user) {
    if (!(await db.user.count())) redirect("/setup");
    redirect("/login");
  }
  redirect("/dashboard");
}
