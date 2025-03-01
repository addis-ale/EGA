import { getCurrentUser } from "@/actions/getCurrentUser";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

// Utility function to get authenticated user ID
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
    const { productId, quantity = 1 } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 }
      );
    }

    const cart = await prisma.cart.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });

    // Check if product already exists in the cart
    const existingProduct = await prisma.cartOnProduct.findFirst({
      where: { cartId: cart.id, productId },
    });

    // Use transaction to ensure consistency
    await prisma.$transaction(async (tx) => {
      if (existingProduct) {
        // Update quantity if product exists
        await tx.cartOnProduct.update({
          where: { id: existingProduct.id },
          data: { quantity: existingProduct.quantity + quantity },
        });
      } else {
        // Add product to cart if not already present
        await tx.cartOnProduct.create({
          data: { cartId: cart.id, productId, quantity },
        });
      }
    });

    return NextResponse.json(
      { message: "Product added to cart successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding product to cart:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
export async function GET() {
  try {
    const userId = await getAuthenticatedUser();
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        cartItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      return NextResponse.json({ cart: [], totalPrice: 0 }, { status: 200 });
    }

    const totalPrice = cart.cartItems.reduce((sum, item) => {
      return sum + (item.product.price ?? 0) * item.quantity;
    }, 0);

    return NextResponse.json(
      { cart: cart.cartItems, totalPrice },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
export async function PATCH(req: Request) {
  try {
    const userId = await getAuthenticatedUser();
    const body = await req.json();
    const { productId, quantity } = body;

    if (!productId || quantity === undefined) {
      return NextResponse.json(
        { message: "Product ID and quantity are required" },
        { status: 400 }
      );
    }

    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    }

    const existingProduct = await prisma.cartOnProduct.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { message: "Product not found in cart" },
        { status: 404 }
      );
    }

    if (quantity === 0) {
      // Remove the product if quantity is set to 0
      await prisma.cartOnProduct.delete({ where: { id: existingProduct.id } });
      return NextResponse.json(
        { message: "Product removed from cart" },
        { status: 200 }
      );
    }

    // Update quantity
    await prisma.cartOnProduct.update({
      where: { id: existingProduct.id },
      data: { quantity },
    });

    return NextResponse.json(
      { message: "Cart updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating cart:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
export async function DELETE() {
  try {
    const userId = await getAuthenticatedUser();

    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    }

    await prisma.$transaction([
      prisma.cartOnProduct.deleteMany({ where: { cartId: cart.id } }),
      prisma.cart.delete({ where: { id: cart.id } }),
    ]);

    return NextResponse.json(
      { message: "Cart deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting cart:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
