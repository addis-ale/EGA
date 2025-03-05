/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextApiRequest, NextApiResponse } from "next";
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
    } = validatedData;

    const newProduct = await prisma.product.create({
      data: {
        productName,
        productDescription,
        uploadedCoverImage,
        discountPercentage,
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

    return NextResponse.json(
      {
        success: true,
        product: newProduct,
        priceDetails: newPriceDetails,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error, res);
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
