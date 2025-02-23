import prisma from "@/lib/prismadb";

import { z, ZodError } from "zod";
import { NextResponse } from "next/server";

const gameSchema = z.object({
  id: z.string().uuid().optional(),
  gameName: z.string().min(1, "game name required"),
  type: z.enum(["TABLE_TOP", "PHYSICAL"]),
  imageUrl: z.string().url().optional(),
  videoUrl: z.string().url().optional(),
  price: z.number().min(0, "price should be postive number"),
  discountPrice: z.number().min(0, "postive number"),
  ageLimit: z.number().min(1, "age must be postive"),
  available: z.number().min(1, "at least one item needed "),
});
const allowedTypes = ["TABLE_TOP", "PHYSICAL"];
export async function POST(req: Request) {
  try {
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

    if (!allowedTypes.includes(body.type)) {
      return NextResponse.json({
        error: "Invalid game type. Allowed values: TABLE_TOP, PHYSICAL",
        status: 400,
      });
    }

    const validation = gameSchema.safeParse({
      ...body,
      price: Number(body.price),
      discountPrice: Number(body.discountPrice ?? 0),
      ageLimit: Number(body.ageLimit),
      available: Number(body.available),
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
      gameName,
      type,
      imageUrl,
      videoUrl,

      price,
      discountPrice,
      ageLimit,
      available,
    } = validation.data;
    await prisma.$connect().catch((error) => {
      throw new Error("dc connection failed" + error);
    });
    const existingGame = await prisma.game.findUnique({
      where: { gameName: gameName },
    });

    if (existingGame) {
      const game = await prisma.available.upsert({
        where: { gameId: existingGame.id },
        update: {
          available: {
            increment: available,
          },
        },
        create: {
          gameId: existingGame.id,
          available: available,
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
          gameName,
          type,
          imageUrl: imageUrl || null,
          videoUrl: videoUrl || null,
          price,
          discountPrice,
          ageLimit,
        },
      });

      await prisma.available.create({
        data: { gameId: game.id, available: available },
      });
      // const availableGame = await prisma.game.findMany({
      //   where: { gameName: gameName, ageLimit: ageLimit },
      // });

      // await prisma.game.updateMany({
      //   where: { gameName: gameName, ageLimit: ageLimit },
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
