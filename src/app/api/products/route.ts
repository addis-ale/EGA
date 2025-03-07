import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/actions/getCurrentUser";

type SortOrder = "asc" | "desc";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category"); // Category filter
    const gameTypeFilter = searchParams.get("gameTypeFilter"); // Game type filter
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const skip = (page - 1) * limit;

    const user = await getCurrentUser();
    let where: {
      gameType?: string;
      OR?: { productName?: { in: string[] }; gameType?: { in: string[] } }[];
      views?: { gt: number };
    } = {};
    const orderBy: { [key: string]: SortOrder } = {};

    // 1️⃣ If no category is provided, fetch all products without pagination
    if (!category || gameTypeFilter === "ALL") {
      if (gameTypeFilter && gameTypeFilter !== "ALL") {
        where.gameType = gameTypeFilter;
      }

      const totalProducts = await prisma.product.count({ where });
      const products = await prisma.product.findMany({
        where,
        orderBy,
        include: {
          priceDetails: true,
          uploadedVideo: true,
          reviews: true,
        },
      });

      return NextResponse.json(
        { success: true, products, totalProducts },
        { status: 200 }
      );
    }

    // 2️⃣ Handle category filtering
    if (category === "recommended") {
      if (!user) {
        return NextResponse.json(
          { success: true, products: [], totalProducts: 0 },
          { status: 200 }
        );
      }

      const searchHistory = await prisma.searchHistory.findMany({
        where: { userId: user.id },
        select: { query: true },
      });

      if (searchHistory.length > 0) {
        const searchKeywords = searchHistory
          .map((entry) => entry.query)
          .filter(Boolean);
        if (searchKeywords.length > 0) {
          where = {
            OR: [
              { productName: { in: searchKeywords } },
              { gameType: { in: searchKeywords } },
            ],
          };
        } else {
          return NextResponse.json(
            { success: true, products: [], totalProducts: 0 },
            { status: 200 }
          );
        }
      } else {
        return NextResponse.json(
          { success: true, products: [], totalProducts: 0 },
          { status: 200 }
        );
      }
    } else if (category === "trending") {
      where.views = { gt: 0 };
      orderBy.views = "desc";
    } else if (category === "top-rated") {
      // Fetch products with their reviews
      const products = await prisma.product.findMany({
        include: {
          priceDetails: true,
          uploadedVideo: true,
          reviews: { select: { rating: true } },
        },
      });

      // Calculate average ratings manually
      const topRatedProducts = products
        .map((product) => {
          const totalStars = product.reviews.reduce(
            (sum, review) => sum + review.rating,
            0
          );
          const averageRating =
            product.reviews.length > 0
              ? totalStars / product.reviews.length
              : 0;
          return { ...product, averageRating };
        })
        .sort((a, b) => b.averageRating - a.averageRating) // Sort by highest rating
        .slice(0, 10); // Get top 10

      return NextResponse.json(
        {
          success: true,
          products: topRatedProducts,
          totalProducts: topRatedProducts.length,
        },
        { status: 200 }
      );
    } else if (category === "deal-of-the-week") {
      // Fetch products with discount percentages
      const dealProducts = await prisma.product.findMany({
        include: {
          priceDetails: {
            select: { salePrice: true, rentalPricePerHour: true },
          },
          uploadedVideo: true,
          reviews: true,
        },
      });

      // Calculate discount percentage manually
      const discountedProducts = dealProducts
        .map((product) => {
          const discount = product.discountPercentage;
          return { ...product, discountPercentage: discount };
        })
        .sort((a, b) => b.discountPercentage - a.discountPercentage) // Sort by highest discount
        .slice(0, 6); // Get top 6

      return NextResponse.json(
        {
          success: true,
          products: discountedProducts,
          totalProducts: discountedProducts.length,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: true, products: [], totalProducts: 0 },
        { status: 200 }
      );
    }

    // 3️⃣ Apply pagination only for categories that require it
    const totalProducts = await prisma.product.count({ where });
    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: {
        priceDetails: true,
        uploadedVideo: true,
        reviews: true,
      },
      take: limit,
      skip,
    });

    return NextResponse.json(
      { success: true, products, totalProducts },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
