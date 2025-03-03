import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { getCurrentUser } from "@/actions/getCurrentUser";
async function getAuthenticatedUser() {
  const user = await getCurrentUser();
  if (!user?.id) {
    throw new Error("User not authenticated");
  }
  return user.id;
}
export async function POST(req: Request) {
  try {
    const userId = await getAuthenticatedUser();
    const body = await req.json();
    const { id, quantity } = body;
    const userCart = await prisma.cart.findUnique({
      where: { userId: userId },
      include: {
        items: true,
      },
    });
    const item = userCart?.items.find((item) => item.id === id);
    if (!item) {
      return NextResponse.json({
        msg: "item not found in this cart",
      });
    }
    const updateCart = await prisma.cartItem.update({
      where: {
        id: id,
      },
      data: {
        quantity: quantity,
      },
    });
    if (!updateCart) {
      return NextResponse.json({
        msg: "failed to update",
        status: 409,
      });
    }

    const updatedcart = await prisma.cartItem.findMany({
      where: { id: userCart?.id },
    });

    const totalPrice = updatedcart?.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0
    );

    const updateTotalPrice = await prisma.cart.update({
      where: { id: userCart?.id },
      data: {
        totalPrice: totalPrice,
      },
    });
    console.log(updateTotalPrice);

    return NextResponse.json({
      msg: "updated succesfully",
      itemupdate: updateCart,
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({ msg: "server error" + error, status: 500 });
  }
}
