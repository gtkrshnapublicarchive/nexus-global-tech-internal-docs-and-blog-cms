import { redirect } from "next/navigation";
import { auth } from "@/core/auth/auth";

export default async function HomePage() {
  const session = await auth();
  if (session?.user?.id) {
    redirect("/feed");
  } else {
    redirect("/login");
  }
}
