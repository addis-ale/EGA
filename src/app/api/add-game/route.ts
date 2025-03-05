import prisma from "@/lib/prismadb";

import { z, ZodError } from "zod";
import { NextResponse } from "next/server";
// import { getCurrentUser } from "@/actions/getCurrentUser";

const gameSchema = z.object({
  id: z.string().uuid().optional(),
  productName: z.string().min(1, "game name required"),
  gameType: z.enum(["TABLE_TOP", "PHYSICAL"]),
  uploadedCoverImage: z.string().url().optional(),
  uploadedVideo: z.string().url().optional(),
  discountPercentage: z.number().min(0, "postive number"),
  productType: z.enum(["SALE", "RENT", "BOTH"]),
  availableForSale: z.number().min(0),
  availableForRent: z.number(),
  ageRestriction: z.string().min(1),
  availableProduct: z.number().min(1, "at least one item needed "),
  productDescription: z.string().min(1, "producr description needed"),
});
const priceDetails = z.object({
  productId: z.string(),
  salesPrice: z.number().optional(),
  rentalPricePerHour: z.number().optional(),
  minimumRentalPeriod: z.number().int().optional(),
  maximumRentalPeriod: z.number().int().optional(),
});
const allowedTypes = ["TABLE_TOP", "PHYSICAL"];
// async function getAuthenticatedUser() {
//   const user = await getCurrentUser();
//   if (!user?.id) {
//     throw new Error("User not authenticated");
//   }
//   return user.id;
// }
export async function POST(req: Request) {
  try {
    // const userId = await getAuthenticatedUser();

    // const user = await prisma.user.findUnique({
    //   where: { id: userId },
    // });
    // const role = user?.role;

    // if (!role || role !== "ADMIN") {
    //   return NextResponse.json({
    //     msg: "unahutorized",
    //   });
    // }
    const body = await req.json();
    console.log(body);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid object" },
        {
          status: 400,
        }
      );
    }

    if (!allowedTypes.includes(body.gameType)) {
      return NextResponse.json({
        error: "Invalid game type. Allowed values: TABLE_TOP, PHYSICAL",
        status: 400,
      });
    }

    const validation = gameSchema.safeParse({
      ...body,

      discountPercentage: Number(body.discountPercentage ?? 0),
      availableProduct: Number(body.availableProduct),
      availableForSale: Number(body.availableForSale),
      availableForRent: Number(body.availableForRent),
    });
    if (!validation.success) {
      return NextResponse.json({
        error: "Invalid data",
        status: 422,
        details: validation.error.format(),
      });
    }
    const validationPrice = priceDetails.safeParse({
      maximumRentalPeriod: Number(body.priceDetails.maximumRentalPeriod),
      minimumRentalPeriod: Number(body.priceDetails.maximumRentalPeriod),
      salePrice: Number(body.priceDetails.maximumRentalPeriod),
      rentalPricePerHour: Number(body.priceDetails.maximumRentalPeriod),
    });
    if (!validationPrice) {
      return NextResponse.json({
        msg: "price detail need",
      });
    }
    // const {
    //   maximumRentalPeriod,
    //   minimumRentalPeriod,
    //   salePrice,
    //   rentalPricePerHour,
    // } = validationPrice?.data;

    console.log(validation.data);
    const {
      productName,
      gameType,
      uploadedCoverImage,
      uploadedVideo,

      discountPercentage,
      ageRestriction,
      availableForRent,
      availableForSale,
      productDescription,
    } = validation.data;
    await prisma.$connect().catch((error) => {
      throw new Error("dc connection failed" + error);
    });

    const product = await prisma.product.create({
      data: {
        productName: productName,
        gameType,
        uploadedCoverImage: uploadedCoverImage || null,
        uploadedVideo: uploadedVideo || null,
        availableForRent,
        availableForSale,
        discountPercentage,
        ageRestriction,
        productDescription,
      },
    });
    console.log(product);
    if (!product) {
      return NextResponse.json({
        message: "error on prisma",
      });
    }
    const priceDetail = await prisma.priceDetails.create({
      data: {
        productId: product.id,
        salePrice: validationPrice?.data?.salesPrice || null,
        rentalPricePerHour: validationPrice?.data?.rentalPricePerHour || null,
        minimumRentalPeriod: validationPrice?.data?.minimumRentalPeriod || null,
        maximumRentalPeriod: validationPrice?.data?.maximumRentalPeriod || null,
      },
    });
    if (!priceDetail) {
      return NextResponse.json({
        msg: "unable to handle price detail",
      });
    }
    console.log(priceDetail);
    return NextResponse.json({
      message: "game created succesuflly",
      status: 201,
      data: product,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({
        detail: error.message,
        status: 500,
      });
    }
    if (error instanceof ZodError) {
      return NextResponse.json({
        error: error.flatten().fieldErrors,
        status: 409,
      });
    }
    return NextResponse.json({
      error: "server error",
      status: 500,
    });
  }
}
