import { redirect } from "next/navigation";
import { getSession } from "@/lib/admin/auth";
import BlogClient from "./BlogClient";

export default async function BlogPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return <BlogClient role={session.role} />;
}
