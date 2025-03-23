/* eslint-disable @typescript-eslint/no-unused-vars */
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { ZodError } from "zod";
import { productSchema } from "@/schemas/productSchema";
import { Prisma } from "@prisma/client";

type SortOrder = "asc" | "desc";
export async function POST(req: Request, res: Response) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      throw new Error("Unauthorized access!");
    }
    const body = await req.json();
    const validatedData = productSchema.parse(body);
    const {
      productName,
      productDescription,
      uploadedCoverImage,
      discountPercentage,
      ageRestriction,
      gameType,
      availableForSale,
      availableForRent,
      productType,
      pricing: {
        salePrice,
        rentalPricePerDay,
        minimumRentalPeriod,
        maximumRentalPeriod,
      },
      uploadedVideo: { setUp, actionCard, gamePlay },
    } = validatedData;

    const newProduct = await prisma.product.create({
      data: {
        productName,
        productDescription,
        uploadedCoverImage,
        discountPercentage: discountPercentage ?? 0,
        ageRestriction,
        gameType,
        availableForSale: availableForSale ?? 0,
        availableForRent: availableForRent ?? 0,
        productType,
      },
    });

    const newPriceDetails = await prisma.priceDetails.create({
      data: {
        productId: newProduct.id,
        salePrice,
        rentalPricePerDay,
        minimumRentalPeriod,
        maximumRentalPeriod,
      },
    });
    const newVideoUpload = await prisma.videoUploaded.create({
      data: {
        productId: newProduct.id,
        setUp,
        actionCard,
        gamePlay,
      },
    });
    return NextResponse.json(
      {
        success: true,
        product: newProduct,
        priceDetails: newPriceDetails,
        uploadedVideo: newVideoUpload,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error, res);
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category"); // Category filter
    const gameTypeFilter = searchParams.get("gameTypeFilter"); // Game type filter
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const skip = (page - 1) * limit;

    const user = await getCurrentUser();
    let where: Prisma.ProductWhereInput = {};
    const orderBy: { [key: string]: SortOrder } = {};

    // If no category is provided, fetch all products without pagination
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

    //CATAGORY FILTERING
    if (category === "recommended") {
      if (!user) {
        return NextResponse.json(
          { success: true, products: [], totalProducts: 0 },
          { status: 200 }
        );
      }
      const search = await prisma.searchHistory.findFirst({
        where: { userId: user.id },
      });

      if (!search) {
        // No search history exists for the user, returning empty response.
        return NextResponse.json(
          { success: true, products: [], totalProducts: 0 },
          { status: 200 }
        );
      }

      // Fetching search queries if search history exists
      const searchHistory = await prisma.search.findMany({
        where: { searchId: search.id },
        select: { searchQuery: true },
        take: 10,
        orderBy: { createdAt: "desc" },
      });
      if (searchHistory.length > 0) {
        const searchKeywords = searchHistory
          .map((entry) => entry.searchQuery)
          .filter(Boolean);
        if (searchKeywords.length > 0) {
          where = {
            OR: searchKeywords.flatMap((keyword) => [
              { productName: { contains: keyword, mode: "insensitive" } },
            ]),
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
        .slice(0, 3);

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
            select: { salePrice: true, rentalPricePerDay: true },
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
        .slice(0, 9); // Get top 9

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
function handleError(error: unknown, res: Response) {
  console.error("API Error:", error);

  if (error instanceof ZodError) {
    return NextResponse.json(
      { success: false, errors: error.errors },
      { status: 400 }
    );
  }

  if (error instanceof Error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 403 }
    );
  }

  return NextResponse.json(
    { success: false, message: "Server Error" },
    { status: 500 }
  );
}
