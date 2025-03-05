import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { getCurrentUser } from "@/actions/getCurrentUser";

async function getAuthenticatedUser() {
  const user = await getCurrentUser();
  if (!user?.id) {
    throw new Error();
  }
  return user.id;
}

export async function GET() {
  try {
    const userId = await getAuthenticatedUser();
    const order = await prisma.order.findFirst({
      where: { userId },
    });
    if (!order) {
      return NextResponse.json({
        msg: "empty order",
        status: 200,
      });
    }
    const orderItem = await prisma.orderItem.findUnique({
      where: { orderId: order.id },
    });
    return NextResponse.json({
      msg: "order return",
      status: 200,
      orderItem,
    });
  } catch (error) {
    return NextResponse.json({
      msg: "server error" + error,
      status: 500,
    });
  }
}
