import { NextResponse } from "next/server";
import createOrder from "src/service/createOrderService";
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { title, amount, authToken, cartId } = data;
    const resultRaq = await createOrder({ title, amount, cartId, authToken });
    if (!resultRaq || !resultRaq.success) {
      return NextResponse.json({
        msg: "error",
      });
    }
    return NextResponse.json({
      mesg: "success",
      resultRaq,
    });
  } catch (error) {
    return NextResponse.json({
      msg: "error from catch" + error,
    });
  }
}
