import prisma from "@/lib/prismadb";

import { z } from "zod";
import { NextResponse } from "next/server";
import { error } from "console";

const gameSchema = z.object({
  id: z.string().uuid().optional(),
  gameName: z.string().min(1, "game name required"),
  type: z.enum(["TABLE_TOP", "PHYSICAL"]),
  imageUrl: z.string().url().optional(),
  videoUrl: z.string().url().optional(),
  price: z.number().min(0, "price should be postive number"),
  discountPrice: z.number().min(0, "postive number"),
  ageLimit: z.number().min(1, "age must be postive"),
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
    } = validation.data;
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
  } catch (error) {
    return NextResponse.json({
      detail: error,
      status: 500,
    });
  }
}
