import { redirect } from "next/navigation";
import { getSession } from "@/lib/admin/auth";
import AdminShell from "@/components/admin/AdminShell";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <AdminShell session={{ name: session.name, role: session.role }}>
      {children}
    </AdminShell>
  );
}
