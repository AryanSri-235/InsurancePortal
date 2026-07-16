import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();
    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      return NextResponse.json({ success: false, error: "Invalid mobile number" }, { status: 400 });
    }

    const msg91AuthKey = process.env.MSG91_AUTH_KEY;
    const msg91TemplateId = process.env.MSG91_TEMPLATE_ID;

    if (msg91AuthKey) {
      if (!msg91TemplateId) {
        console.error("Missing MSG91_TEMPLATE_ID in environment");
        return NextResponse.json({ success: false, error: "MSG91 Template ID configuration error" }, { status: 500 });
      }

      // Send OTP via MSG91
      const url = `https://control.msg91.com/api/v5/otp?template_id=${msg91TemplateId}&mobile=91${phone}&authkey=${msg91AuthKey}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({})
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("MSG91 API error:", errText);
        return NextResponse.json({ success: false, error: "Failed to send OTP via MSG91" }, { status: 500 });
      }

      const resData = await response.json();
      if (resData.type === "success") {
        return NextResponse.json({ success: true, verificationId: "msg91" });
      } else {
        console.error("MSG91 response failed:", resData);
        return NextResponse.json({ success: false, error: resData.message || "Failed to send OTP" }, { status: 400 });
      }
    }

    const customerId = process.env.MESSAGE_CENTRAL_CUSTOMER_ID;
    const authToken = process.env.MESSAGE_CENTRAL_AUTH_TOKEN;

    if (!customerId || !authToken) {
      console.error("Missing Message Central configuration in environment");
      return NextResponse.json({ success: false, error: "Server configuration error" }, { status: 500 });
    }

    const url = `https://cpaas.messagecentral.com/verification/v3/send?flowType=SMS&mobileNumber=${phone}&countryCode=91&customerId=${customerId}&otpLength=6`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "authToken": authToken
      }
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Message Central API error:", errText);
      return NextResponse.json({ success: false, error: "Failed to send OTP" }, { status: 500 });
    }

    const resData = await response.json();
    if (resData.responseCode === 200 && resData.data?.verificationId) {
      return NextResponse.json({ success: true, verificationId: resData.data.verificationId });
    } else {
      console.error("Message Central response failed:", resData);
      return NextResponse.json({ success: false, error: resData.message || "Failed to send OTP" }, { status: 400 });
    }
  } catch (err: any) {
    console.error("Error in send-otp route:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
