import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { z, ZodError } from "zod";
const cart = z.object({
  cartId: z.string().min(1, "cartid need"),
  cartItemId: z.string().min(1, "cart item id needed"),
});

export async function DELETE(
  req: Request,
  context: { params: { cartId: string; cartItemId: string } }
) {
  try {
    const { params } = context;
    const { cartId, cartItemId } = params;

    if (!cartId || !cartItemId) {
      return NextResponse.json({
        error: "item needed",
        status: 409,
      });
    }
    const validation = cart.safeParse({ cartId, cartItemId });
    if (!validation.success) {
      return NextResponse.json({
        error: validation.error.flatten().fieldErrors,
        status: 422,
      });
    }
    await prisma.$connect().catch((error) => {
      throw new Error("db connection", error);
    });

    const itemfind = await prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: true,
      },
    });
    if (!itemfind) {
      return NextResponse.json({
        error: "cart with this id not found",
        status: 409,
      });
    }
    const cartitemid = itemfind?.items.find((item) => item.id === cartItemId);
    if (!cartitemid) {
      return NextResponse.json({
        error: "the item is not found in the cart",
        status: 409,
      });
    }
    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    return NextResponse.json({
      message: "item deleted",
      status: 200,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({
        error: error.message,
        status: 409,
      });
    } else if (error instanceof ZodError) {
      return NextResponse.json({
        error: error.flatten().fieldErrors,
        status: 400,
      });
    }
    return NextResponse.json({
      error: "server error",
      status: 500,
    });
  }
}
