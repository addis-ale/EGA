/* eslint-disable @typescript-eslint/no-unused-vars */
import prisma from "@/lib/prismadb";
import { productSchema } from "@/schemas/productSchema";
import { ZodError } from "zod";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export async function POST(req: Request, res: Response) {
  try {
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
        rentalPricePerHour,
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
        rentalPricePerHour,
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
    const category = searchParams.get("category");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "3", 10);
    const skip = (page - 1) * limit;

    let orderBy = {};
    let where = {};

    switch (category) {
      case "trending":
        where = {
          views: {
            gt: 0,
          },
        };
        orderBy = {
          views: "desc", // Sort by highest views
        };
        break;
      default:
        // No category provided, fetch all products
        break;
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
      { success: false, error: "Failed to fetch products" },
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
      { success: false, message: "Record not found" },
      { status: 403 }
    );
  }

  return NextResponse.json(
    { success: false, message: "Server Error" },
    { status: 500 }
  );
}
