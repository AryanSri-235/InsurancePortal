const AUTH_KEY   = process.env.MSG91_AUTH_KEY   ?? "";
const TEMPLATE_ID = process.env.MSG91_TEMPLATE_ID ?? "";
const BASE        = "https://control.msg91.com/api/v5/otp";

export async function msg91SendOtp(phone: string): Promise<{ success: boolean; error?: string }> {
  if (!AUTH_KEY) return { success: false, error: "MSG91_AUTH_KEY not set" };
  try {
    const res  = await fetch(BASE, {
      method: "POST",
      headers: { authkey: AUTH_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ template_id: TEMPLATE_ID, mobile: `91${phone}`, otp_length: 6, otp_expiry: 10 }),
    });
    const data = await res.json();
    return data.type === "success" ? { success: true } : { success: false, error: data.message };
  } catch {
    return { success: false, error: "MSG91 request failed" };
  }
}

export async function msg91VerifyOtp(phone: string, otp: string): Promise<{ success: boolean }> {
  if (!AUTH_KEY) return { success: false };
  try {
    const res  = await fetch(`${BASE}/verify`, {
      method: "POST",
      headers: { authkey: AUTH_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ mobile: `91${phone}`, otp }),
    });
    const data = await res.json();
    return { success: data.type === "success" };
  } catch {
    return { success: false };
  }
}
