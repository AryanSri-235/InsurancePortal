"use client";

import Swal from "sweetalert2";

interface Props {
  name: string;
  phone: string;
  email?: string | null;
  category?: string | null;
  policyNumber?: string | null;
}

export default function RenewalRequestButton({ name, phone, email, category, policyNumber }: Props) {
  async function handleRenew() {
    const result = await Swal.fire({
      icon: "question",
      title: "Request Renewal?",
      html: `Our advisor will call you at <b>+91 ${phone}</b> to assist with${policyNumber ? ` policy <b>${policyNumber}</b>` : " your"} renewal.`,
      showCancelButton: true,
      confirmButtonText: "Yes, request renewal",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#1E54D0",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email: email ?? undefined,
          category: category ?? undefined,
          leadType: "renewal",
        }),
      });
      if (!res.ok) throw new Error();
      Swal.fire({
        icon: "success",
        title: "Renewal Requested!",
        text: "Our advisor will call you within 30 minutes to help with your renewal.",
        confirmButtonColor: "#1E54D0",
        confirmButtonText: "Got it!",
      });
    } catch {
      Swal.fire({ icon: "error", title: "Oops!", text: "Something went wrong. Please try again.", confirmButtonColor: "#1E54D0" });
    }
  }

  return (
    <button
      onClick={handleRenew}
      style={{ fontSize: 11, fontWeight: 700, color: "#1E54D0", background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 6, padding: "4px 10px", cursor: "pointer", whiteSpace: "nowrap" }}
    >
      Renew →
    </button>
  );
}
