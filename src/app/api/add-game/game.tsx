import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@lib/prismadb";
import { z } from "zod";

const gameSchema = z.object({
  id: z.string().uuid().optional(),
  gameName: z.string().min(1, "game name required"),
  type: z.enum(["Table_Top", "Physical"]),
  imageUrl: z.string().url(),
  videoUrl: z.string().url(),
  price: z.number().min(0, "price should be postive number"),
  discountPrice: z.number().optional(),
  ageLimit: z.number().min(1, "age must be postive"),
  review: z
    .array(
      z.object({
        id: z.string(),
      })
    )
    .optional(),
});

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  const validation = gameSchema.safeParse(req.body);
  if (!validation) {
    return res.status(403).json("error from zod");
  }

  const { gameName, type, imageUrl, videoUrl, price, discountPrice, ageLimit } =
    req.body;
  const game = await prisma.game.create({
    data: {
      gameName,
      type,
      imageUrl,
      videoUrl,
      price,
      discountPrice,
      ageLimit,
    },
  });
}
