import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { getCurrentUser } from "@/actions/getCurrentUser";

// Utility function to get user ID
export async function getAuthenticatedUser() {
  const user = await getCurrentUser();
  if (!user?.id) {
    throw new Error("User not authenticated");
  }
  return user.id;
}

// 🟢 Toggle product in wishlist
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
    const existingEntry = await prisma.wishlistOnProduct.findUnique({
      where: { wishlistId_productId: { wishlistId: wishlist.id, productId } },
    });

    if (existingEntry) {
      // If the product exists, remove it from the wishlist
      await prisma.wishlistOnProduct.delete({
        where: { id: existingEntry.id },
      });
      return NextResponse.json(
        { message: "Product removed from wishlist" },
        { status: 200 }
      );
    } else {
      // If the product doesn't exist, add it to the wishlist
      await prisma.wishlistOnProduct.create({
        data: { wishlistId: wishlist.id, productId },
      });
      return NextResponse.json(
        { message: "Product added to wishlist" },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error toggling wishlist:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || "Internal Server Error" },
        { status: error.message === "User not authenticated" ? 401 : 500 }
      );
    }
  }
}

// 🟢 Get all wishlist items for the user
export async function GET() {
  try {
    const userId = await getAuthenticatedUser();

    const wishlist = await prisma.wishlist.findUnique({
      where: { userId },
      include: {
        wishlists: {
          include: {
            product: {
              include: { priceDetails: true, reviews: true },
            },
          },
        },
      },
    });

    if (!wishlist) {
      return NextResponse.json({ wishlist: [] }, { status: 200 });
    }

    const products = wishlist.wishlists.map((entry) => entry.product);

    return NextResponse.json({ wishlist: products }, { status: 200 });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
