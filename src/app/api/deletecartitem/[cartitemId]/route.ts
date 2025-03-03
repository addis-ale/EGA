import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { z, ZodError } from "zod";
import { getCurrentUser } from "@/actions/getCurrentUser";

const cartSchema = z.object({
  cartItemId: z.string().min(1, "Cart item ID is required"),
});

async function getAuthentication() {
  const user = await getCurrentUser();
  if (!user?.id) {
    throw new Error("Unauthorized");
  }
  return user.id;
}

export async function DELETE(
  req: Request,
  context: { params: { cartitemid: string } }
) {
  try {
    const userId = await getAuthentication();

    const { cartitemid } = context.params;

    const validation = cartSchema.safeParse({ cartItemId: cartitemid });
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    await prisma.$connect();

    const cart = await prisma.cart.findFirst({
      where: { userId, items: { some: { id: cartitemid } } },
      include: { items: true },
    });

    if (!cart) {
      return NextResponse.json(
        { error: "Cart item not found" },
        { status: 404 }
      );
    }

    const cartItemid = cart.items.find((item) => item.id === cartitemid);
    if (!cartItemid) {
      return NextResponse.json(
        { error: "Item not found in cart" },
        { status: 404 }
      );
    }

    await prisma.cartItem.delete({
      where: { id: cartItemid.id },
    });

    return NextResponse.json(
      { message: "Item deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Server error" },
      { status: 500 }
    );
  }
}
