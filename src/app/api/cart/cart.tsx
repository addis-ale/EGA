import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
const prisma = new PrismaClient();

const cartitemschema = z.object({
  id: z.string().uuid().optional(),
  cartId: z.string().min(1, "cart id is need"),
  productId: z.string().min(1, "product id required"),
  quantity: z.number().int().min(1, "at least 1 item required"),
  price: z.number().min(0, "price should be postive number"),
});
const cartSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().min(1, "user id required"),
  item: z.array(cartitemschema).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

//
//
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    await prisma.Cartitem;
  }
}
