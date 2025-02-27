import { NextResponse } from "next/server";
import { Server } from "socket.io";

export async function POST(req) {
  try {
    const { orderId, totalAmount, sign } = await req.json();

    const expectedSign = crypto
      .createHmac("sha256", process.env.TELEBIRR_APP_KEY)
      .update(`orderId=${orderId}&totalAmount=${totalAmount}`)
      .digest("hex");

    if (expectedSign !== sign) {
      return NextResponse.json(
        { message: "Invalid signature" },
        { status: 400 }
      );
    }

    res.socket.server.io.emit("paymentUpdate", { orderId, status: "PAID" });

    return NextResponse.json({ message: "Payment processed" });
  } catch (error) {
    return NextResponse.json(
      { message: "Error processing payment", error: error.message },
      { status: 500 }
    );
  }
}
