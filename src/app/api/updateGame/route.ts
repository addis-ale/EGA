import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { z, ZodError } from "zod";

const gameSchema = z.object({
  id: z.string(),
  gameName: z.string().min(1, "game name required"),
  type: z.enum(["TABLE_TOP", "PHYSICAL"]),
  imageUrl: z.string().url().optional(),
  videoUrl: z.string().url().optional(),
  price: z.number().min(0, "price should be postive number").optional(),
  discountPrice: z.number().min(0, "postive number").optional().nullable(),
  available: z.number().min(1, "at least one item needed").optional(),
  ageLimit: z.number().min(1, "age must be postive").optional().nullable(),
});
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    console.log(body);

    const validation = gameSchema.safeParse({
      ...body,
      price: Number(body.price),
      discountPrice: Number(body.discountPrice),
      ageLimit: Number(body.ageLimit),
    });
    if (!validation.success) {
      return NextResponse.json({
        error: JSON.stringify({
          errors: validation.error.flatten().fieldErrors,
        }),
      });
    }
    const validateData = validation.data;
    const {
      id,
      gameName,
      imageUrl,
      videoUrl,
      price,
      type,
      discountPrice,
      ageLimit,
      available,
    } = validateData;
    await prisma.$connect().catch((error) => {
      throw new Error("db connection", error);
    });

    const existingGame = await prisma.game.findUnique({
      where: { id },
    });
    if (!existingGame) {
      return NextResponse.json({
        error: "game not found",
      });
    }
    const gameUpdate = await prisma.game.update({
      where: {
        id: id,
      },
      data: {
        ...(gameName && { gameName }),
        ...(imageUrl && { imageUrl }),
        ...(videoUrl && { videoUrl }),
        ...(price && { price }),
        ...(type && { type }),
        ...(discountPrice && { discountPrice }),
        ...(ageLimit && { ageLimit }),
      },
    });

    await prisma.available.update({
      where: { gameId: id },
      data: {
        available: available,
      },
    });
    console.log(gameUpdate);
    return NextResponse.json({
      message: "game update succesfuly",
      data: gameUpdate,
      status: 200,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({
        error: { errors: error.flatten().fieldErrors },
      });
    } else if (error instanceof Error) {
      return NextResponse.json({
        detail: error.message,
      });
    }
    return NextResponse.json({
      error: "server error",
      status: 500,
    });
  } finally {
    await prisma.$disconnect();
  }
}
