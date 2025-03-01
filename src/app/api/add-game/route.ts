import prisma from "@/lib/prismadb";

import { z, ZodError } from "zod";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/actions/getCurrentUser";

const gameSchema = z.object({
  id: z.string().uuid().optional(),
  productName: z.string().min(1, "game name required"),
  gameType: z.enum(["TABLE_TOP", "PHYSICAL"]),
  uploadedCoverImage: z.string().url().optional(),
  uploadedVideo: z.string().url().optional(),
  price: z.number().min(0, "price should be postive number"),
  discountPercentage: z.number().min(0, "postive number"),
  ageRestriction: z.number().min(1, "age must be postive"),
  availableProduct: z.number().min(1, "at least one item needed "),
  productDescription: z.string().min(1, "producr description needed"),
});
const allowedTypes = ["TABLE_TOP", "PHYSICAL"];
export async function POST(req: Request) {
  try {
    // const user = await getCurrentUser();
    // if (!user) {
    //   return NextResponse.json({
    //     message: "user not found",
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
      price: Number(body.price),
      discountPercentage: Number(body.discountPercentage ?? 0),
      ageRestriction: Number(body.ageRestriction),
      availableProduct: Number(body.availableProduct),
    });
    if (!validation.success) {
      return NextResponse.json({
        error: "Invalid data",
        status: 422,
        details: validation.error.format(),
      });
    }
    console.log(validation.data);
    const {
      productName,
      gameType,
      uploadedCoverImage,
      uploadedVideo,

      price,
      discountPercentage,
      ageRestriction,
      availableProduct,
      productDescription,
    } = validation.data;
    await prisma.$connect().catch((error) => {
      throw new Error("dc connection failed" + error);
    });
    const existingGame = await prisma.game.findUnique({
      where: { productName: productName },
    });

    if (existingGame) {
      const game = await prisma.available.upsert({
        where: { gameId: existingGame.id },
        update: {
          availableProduct: {
            increment: availableProduct,
          },
        },
        create: {
          gameId: existingGame.id,
          availableProduct: availableProduct,
        },
      });
      return NextResponse.json({
        message: "game added",
        status: 200,
        game: game,
      });
    } else {
      const game = await prisma.game.create({
        data: {
          productName: productName,
          gameType,
          uploadedCoverImage: uploadedCoverImage || null,
          uploadedVideo: uploadedVideo || null,
          price,
          discountPercentage,
          ageRestriction,
          productDescription,
        },
      });

      await prisma.available.create({
        data: { gameId: game.id, availableProduct: availableProduct },
      });
      // const availableGame = await prisma.game.findMany({
      //   where: { gameName: gameName, ageRestriction: ageRestriction },
      // });

      // await prisma.game.updateMany({
      //   where: { gameName: gameName, ageRestriction: ageRestriction },
      //   data: {
      //     available: availableGame.length + available,
      //   },
      // });

      console.log(game);
      if (!game) {
        return NextResponse.json({
          message: "error on prisma",
        });
      }
      return NextResponse.json({
        message: "game created succesuflly",
        status: 201,
        data: game,
      });
    }
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
