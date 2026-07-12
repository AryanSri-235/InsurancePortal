import { redirect } from "next/navigation";
import { getSession } from "@/lib/admin/auth";
import PoliciesClient from "./PoliciesClient";

export default async function PoliciesPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return <PoliciesClient role={session.role} />;
}
