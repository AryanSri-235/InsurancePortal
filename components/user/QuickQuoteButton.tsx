"use client";

import Swal from "sweetalert2";

interface Props {
  name: string;
  phone: string;
  email?: string | null;
  city?: string | null;
  small?: boolean;
  sidebar?: boolean;
}

export default function QuickQuoteButton({ name, phone, email, city, small, sidebar }: Props) {
  async function handleQuote() {
    const { value: category } = await Swal.fire({
      title: "What are you looking for?",
      input: "select",
      inputOptions: {
        term:               "Term Insurance",
        health:             "Health Insurance",
        life:               "Life Insurance",
        motor:              "Motor Insurance",
        car:                "Car Insurance",
        "two-wheeler":      "Two Wheeler Insurance",
        "family-health":    "Family Health Insurance",
        "group-health":     "Group Health Insurance",
        travel:             "Travel Insurance",
        home:               "Home Insurance",
        "term-women":       "Term Insurance for Women",
        "return-premium":   "Term Plans with Return of Premium",
        "guaranteed-return":"Guaranteed Return Plans",
        "child-savings":    "Child Savings Plans",
        retirement:         "Retirement Plans",
      },
      inputPlaceholder: "Select insurance type",
      showCancelButton: true,
      confirmButtonText: "Send Request",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#186874",
      inputValidator: (value) => {
        if (!value) return "Please select an insurance type";
      },
    });

    if (!category) return;

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email: email ?? undefined, city: city ?? undefined, category, leadType: "quote" }),
      });

      if (!res.ok) throw new Error();

      Swal.fire({
        icon: "success",
        title: "Quote Requested!",
        html: `Our <b>${getCategoryLabel(category)}</b> advisor will call you at <b>+91 ${phone}</b> within 30 minutes.`,
        confirmButtonColor: "#186874",
        confirmButtonText: "Got it!",
      });
    } catch {
      Swal.fire({ icon: "error", title: "Oops!", text: "Something went wrong. Please try again.", confirmButtonColor: "#186874" });
    }
  }

  const cls = sidebar
    ? "w-full text-center text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg py-2 transition-colors"
    : small
    ? "text-xs font-semibold text-blue-600 hover:underline"
    : "flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors shadow-md shadow-blue-200";

  return (
    <button onClick={handleQuote} className={cls}>
      {sidebar ? "Get Free Quote" : "Get free quote →"}
    </button>
  );
}

function getCategoryLabel(cat: string) {
  const map: Record<string, string> = {
    term:               "Term Insurance",
    health:             "Health Insurance",
    life:               "Life Insurance",
    motor:              "Motor Insurance",
    car:                "Car Insurance",
    "two-wheeler":      "Two Wheeler Insurance",
    "family-health":    "Family Health Insurance",
    "group-health":     "Group Health Insurance",
    travel:             "Travel Insurance",
    home:               "Home Insurance",
    "term-women":       "Term Insurance for Women",
    "return-premium":   "Term Plans with Return of Premium",
    "guaranteed-return":"Guaranteed Return Plans",
    "child-savings":    "Child Savings Plans",
    retirement:         "Retirement Plans",
  };
  return map[cat] ?? cat;
}
