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

// ✅ Add item to cart
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

    // Ensure the cart exists for the user
    const cart = await prisma.cart.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });

    // Check if the product already exists in the cart
    const existingProduct = await prisma.cartOnProduct.findFirst({
      where: { cartId: cart.id, productId },
    });

    // Add or update the product in the cart
    await prisma.$transaction(async (tx) => {
      if (existingProduct) {
        await tx.cartOnProduct.update({
          where: { id: existingProduct.id },
          data: { quantity: existingProduct.quantity + quantity },
        });
      } else {
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
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

// ✅ Fetch cart items
export async function GET() {
  try {
    const userId = await getAuthenticatedUser();
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { cartItems: { include: { product: true } } },
    });

    if (!cart)
      return NextResponse.json(
        { cart: [], totalPrice: 0, totalQuantity: 0 },
        { status: 200 }
      );

    // Extract products with quantity
    const products = cart.cartItems.map((item) => ({
      ...item.product,
      quantity: item.quantity,
    }));

    // Calculate total price
    const totalPrice = products.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    // Calculate total quantity
    const totalQuantity = products.reduce(
      (total, item) => total + item.quantity,
      0
    );

    return NextResponse.json(
      { cart: products, totalPrice, totalQuantity },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}

// ✅ Update cart item quantity
export async function PATCH(req: Request) {
  try {
    const userId = await getAuthenticatedUser();
    const { productId, quantity } = await req.json();

    if (!productId || quantity === undefined) {
      return NextResponse.json(
        { message: "Product ID and quantity are required" },
        { status: 400 }
      );
    }

    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart)
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });

    const existingProduct = await prisma.cartOnProduct.findFirst({
      where: { cartId: cart.id, productId },
    });
    if (!existingProduct)
      return NextResponse.json(
        { message: "Product not found in cart" },
        { status: 404 }
      );

    // Handle the case where quantity is set to 0 (remove the product)
    if (quantity === 0) {
      await prisma.cartOnProduct.delete({ where: { id: existingProduct.id } });
      return NextResponse.json(
        { message: "Product removed from cart" },
        { status: 200 }
      );
    }

    // Update the quantity if it's not 0
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
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}

// ✅ Remove item from cart
export async function DELETE(req: Request) {
  try {
    const { productId } = await req.json();
    if (!productId)
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 }
      );

    const userId = await getAuthenticatedUser();
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart)
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });

    const cartItem = await prisma.cartOnProduct.findFirst({
      where: { cartId: cart.id, productId },
    });
    if (!cartItem)
      return NextResponse.json(
        { message: "Product not found in cart" },
        { status: 404 }
      );

    await prisma.cartOnProduct.delete({ where: { id: cartItem.id } });
    return NextResponse.json(
      { message: "Product removed from cart successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting product from cart:", error);
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
