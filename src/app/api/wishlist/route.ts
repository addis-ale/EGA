import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { getCurrentUser } from "@/actions/getCurrentUser";

// Utility function to get user ID
async function getAuthenticatedUser() {
  const user = await getCurrentUser();
  if (!user?.id) {
    throw new Error("User not authenticated");
  }
  return user.id;
}

// 🟢 Add product to wishlist
export async function POST(req: Request) {
  try {
    const userId = await getAuthenticatedUser();
    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Ensure the user has a wishlist
    let wishlist = await prisma.wishlist.findUnique({ where: { userId } });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({ data: { userId } });
    }

    // Check if the product is already in the wishlist
    const existingEntry = await prisma.wishlistOnProduct.findFirst({
      where: { wishlistId: wishlist.id, productId },
    });

    if (existingEntry) {
      return NextResponse.json(
        { message: "Product already in wishlist" },
        { status: 400 }
      );
    }

    // Add product to wishlist
    await prisma.wishlistOnProduct.create({
      data: { wishlistId: wishlist.id, productId },
    });

    return NextResponse.json(
      { message: "Product added to wishlist" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    if (error instanceof Error)
      return NextResponse.json(
        { error: error.message || "Internal Server Error" },
        { status: error.message === "User not authenticated" ? 401 : 500 }
      );
  }
}

// 🟡 Get user's wishlist
export async function GET() {
  try {
    const userId = await getAuthenticatedUser();

    // Fetch wishlist and include related products
    const wishlist = await prisma.wishlist.findUnique({
      where: { userId },
      include: {
        wishlists: { include: { product: true } }, // Assuming 'wishlists' is the relation and 'product' is the related model
      },
    });

    // Safely access the product data
    const products = wishlist?.wishlists.map((item) => item.product) || [];

    // Return the products array
    return NextResponse.json({ wishlist: products }, { status: 200 });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    // Handle different types of error responses
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || "Internal Server Error" },
        { status: error.message === "User not authenticated" ? 401 : 500 }
      );
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}

// 🔴 Remove product from wishlist
export async function DELETE(req: Request) {
  try {
    const userId = await getAuthenticatedUser();
    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const wishlist = await prisma.wishlist.findUnique({ where: { userId } });

    if (!wishlist) {
      return NextResponse.json(
        { error: "Wishlist not found" },
        { status: 404 }
      );
    }

    // Remove product from wishlist
    const deleted = await prisma.wishlistOnProduct.deleteMany({
      where: { wishlistId: wishlist.id, productId },
    });

    if (deleted.count === 0) {
      return NextResponse.json(
        { error: "Product not found in wishlist" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Product removed from wishlist" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    if (error instanceof Error)
      return NextResponse.json(
        { error: error.message || "Internal Server Error" },
        { status: error.message === "User not authenticated" ? 401 : 500 }
      );
  }
}
