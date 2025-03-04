import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import order from "src/service/order";
export async function POST(req: Request) {
  const data = await req.json();
  const { cart_id, status } = data;
  if (!cart_id) {
    return NextResponse.json({
      msg: "cart_id need",
      status: 403,
    });
  }

  await prisma.cart.update({
    where: { id: cart_id },
    data: {
      paymentStatus: status === "SUCCESS" ? "Paid" : "failed",
    },
  });

  if (status === "SUCCESS") {
    const addorder = await order(req);
    if (!addorder) {
      return NextResponse.json({
        msg: "error on adding order",
        status: 401,
      });
    }
    const deleteCart = await prisma.cart.delete({
      where: { id: cart_id },
    });
    if (!deleteCart) {
      return NextResponse.json({
        msg: "error occured when delete cart",
      });
    }
    return NextResponse.json({
      msg: "order added",
      data: "order created",
    });
  }
}
