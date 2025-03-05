import { NextResponse } from "next/server";
import crypto from "crypto";
import axios from "axios";
import { z } from "zod";

const paymentSchema = z.object({
  amount: z.number().min(1),
  orderId: z.string(),
});

export async function POST(req: Request) {
  try {
    const { amount, orderId, customerPhone } = await req.json();
    const pay = paymentSchema.safeParse({ amount, orderId });
    if (!pay.success) {
      return NextResponse.json({
        error: pay.error.flatten().fieldErrors,
      });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params: any = {
      appId: process.env.TELEBIRR_APP_ID,
      shortCode: process.env.TELEBIRR_SHORT_CODE,
      notifyUrl: process.env.TELEBIRR_NOTIFY_URL,
      returnUrl: process.env.TELEBIRR_RETURN_URL,
      subject: "Purchase from EG-STORE",
      totalAmount: amount,
      nonce: crypto.randomBytes(16).toString("hex"),
      orderId,
      timestamp: Date.now().toString(),
      timeoutExpress: "30m",
      customerPhone,
    };

    // Generate HMAC signature
    const signString = Object.keys(params)
      .sort()
      .map((key) => `${key}=${params[key]}`)
      .join("&");
    console.log(signString);
    // params.sign = crypto
    //   .createHmac("sha256", process.env.TELEBIRR_APP_KEY)
    //   .update(signString)
    //   .digest("hex");

    // const response = await axios.post(
    //   process.env.TELEBIRR_GATEWAY_URL,
    //   params,
    //   {
    //     headers: { "Content-Type": "application/json" },
    //   }
    // );

    // return NextResponse.json(response.data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json(
      { message: "Payment initiation failed", error: error.message },
      { status: 500 }
    );
  }
}
