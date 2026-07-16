"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/login", { method: "DELETE" });
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="acct-logout"
      style={{ display: "flex", alignItems: "center", gap: 6, color: "#5C6B84", fontSize: 11, fontWeight: 500, background: "none", border: "none", cursor: "pointer", padding: "5px 0", transition: "color 0.15s" }}
    >
      <LogOut width="12" height="12" />
      <span>Sign out</span>
    </button>
  );
}
