import cartSchema from "@/schemas/productSchema";
import { getAuthenticatedUser } from "../wishlist/route";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import prisma from "@/lib/prismadb";

export async function POST(req: Request) {
  try {
    const userId = await getAuthenticatedUser();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = cartSchema.parse(body);
    const { productId, type, quantity, rentalStart, rentalEnd } = validatedData;
    console.log("Validated Data:", validatedData);

    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: { cartItems: true },
    });

    if (!cart) {
      console.log("Cart not found, creating a new one...");
      cart = await prisma.cart.create({
        data: { userId, cartItems: { create: [] } },
        include: { cartItems: true },
      });
    }

    if (type === "SALE") {
      if (!quantity || quantity <= 0) {
        return NextResponse.json(
          { error: "Invalid quantity for sale item" },
          { status: 400 }
        );
      }

      let existingCartItem = cart.cartItems.find(
        (item) => item.productId === productId && item.type === "SALE"
      );

      if (existingCartItem) {
        console.log("Product found in cart (SALE), updating quantity...");
        existingCartItem = await prisma.cartOnProduct.update({
          where: { id: existingCartItem.id },
          data: { quantity: (existingCartItem.quantity ?? 0) + quantity },
        });
      } else {
        console.log("Product not in cart (SALE), adding new item...");
        existingCartItem = await prisma.cartOnProduct.create({
          data: {
            cartId: cart.id,
            productId,
            quantity,
            type: "SALE",
          },
        });
      }

      return NextResponse.json(
        { success: true, message: "Cart updated", cartItem: existingCartItem },
        { status: 201 }
      );
    }

    if (type === "RENT") {
      if (!rentalStart || !rentalEnd) {
        return NextResponse.json(
          { error: "Rental start and end dates are required" },
          { status: 400 }
        );
      }

      const rentalStartDate = new Date(rentalStart);
      const rentalEndDate = new Date(rentalEnd);

      let existingRental = cart.cartItems.find(
        (item) =>
          item.productId === productId &&
          item.type === "RENT" &&
          item.rentalStart?.toISOString() === rentalStartDate.toISOString() &&
          item.rentalEnd?.toISOString() === rentalEndDate.toISOString()
      );

      if (existingRental) {
        console.log(
          "Product found in cart (RENT) for the same period, updating quantity..."
        );
        existingRental = await prisma.cartOnProduct.update({
          where: { id: existingRental.id },
          data: { quantity: (existingRental.quantity ?? 0) + quantity },
        });
      } else {
        console.log("Adding new rental item...");
        existingRental = await prisma.cartOnProduct.create({
          data: {
            cartId: cart.id,
            productId,
            rentalStart: rentalStartDate,
            rentalEnd: rentalEndDate,
            type: "RENT",
            quantity,
          },
        });
      }

      return NextResponse.json(
        { success: true, message: "Cart updated", cartItem: existingRental },
        { status: 201 }
      );
    }

    return NextResponse.json({ error: "Invalid item type" }, { status: 400 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 422 }
      );
    }
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Error processing cart request:", errorMessage);
    return NextResponse.json(
      { error: "Internal Server Error", message: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const userId = await getAuthenticatedUser();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        cartItems: {
          include: {
            product: { include: { priceDetails: true, reviews: true } },
          },
        },
      },
    });

    if (!cart) {
      return NextResponse.json(
        { cart: [], totalPrice: 0, totalQuantity: 0 },
        { status: 200 }
      );
    }

    const cartItems = cart.cartItems.map((item) => ({
      id: item.id,
      productId: item.productId,
      type: item.type,
      quantity: item.quantity,
      rentalStart: item.rentalStart,
      rentalEnd: item.rentalEnd,
      product: item.product,
      priceDetails: item.product.priceDetails,
      reviews: item.product.reviews,
    }));

    // Calculate total price based on SALE or RENT type
    const totalPrice = cartItems.reduce((acc, item) => {
      const { priceDetails, type, quantity, rentalStart, rentalEnd } = item;

      if (type === "SALE") {
        return acc + (quantity || 1) * (priceDetails?.salePrice || 0);
      } else if (type === "RENT" && rentalStart && rentalEnd) {
        const startDate = new Date(rentalStart);
        const endDate = new Date(rentalEnd);
        const rentalDays = Math.max(
          1,
          Math.ceil(
            (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
          )
        );
        return (
          acc +
          (quantity || 1) * (priceDetails?.rentalPricePerHour || 0) * rentalDays
        );
      }
      return acc;
    }, 0);

    const totalQuantity = cartItems.reduce(
      (acc, item) => acc + (item.quantity || 1),
      0
    );

    return NextResponse.json(
      { cart: cartItems, totalPrice, totalQuantity },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { error: "Internal Server Error", message: errorMessage },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const userId = await getAuthenticatedUser();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { cartItemId } = await req.json();
    await prisma.cartOnProduct.delete({ where: { id: cartItemId } });

    return NextResponse.json(
      { success: true, message: "Item removed from cart" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error", message: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const userId = await getAuthenticatedUser();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { productId, quantity, rentalStart, rentalEnd } = await req.json();

    const updatedCartItem = await prisma.cartOnProduct.update({
      where: { id: productId },
      data: {
        quantity,
        rentalStart: rentalStart ? new Date(rentalStart) : undefined,
        rentalEnd: rentalEnd ? new Date(rentalEnd) : undefined,
      },
    });

    return NextResponse.json(
      { success: true, message: "Cart updated", cartItem: updatedCartItem },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error", message: (error as Error).message },
      { status: 500 }
    );
  }
}
