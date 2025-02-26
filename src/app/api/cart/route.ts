import { z } from "zod";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt";

const cartitemschema = z.object({
  id: z.string().uuid().optional(),
  cartId: z.string().min(1, "cart id is need").optional(),
  productId: z.string().min(1, "product id required"),
  quantity: z.number().int().min(1, "at least 1 item required"),
  imageUruploadedCoverImagel: z.string().url(),
});
const cartSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().min(1, "user id required"),
  items: z.array(cartitemschema).optional(),
  totalPrice: z.number().min(0, "price should be postive number"),

  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export async function POST(req: Request) {
  try {
    // const token=getToken({req,secret:process.env.NEXTAUTH_SECRET})
    const body = await req.json();
    console.log(body);
    const validation = cartSchema.safeParse({
      ...body,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      item: body.item?.map((item: any) => ({
        ...item,
        quantity: Number(item.quantity),
        price: Number(item.price),
        totalPrice: Number(item.totalPrice),
      })),
    });

    if (!validation.success) {
      return NextResponse.json({
        message: "Inavlid Input",
        status: 422,
      });
    }
    const { items, userId, totalPrice } = validation.data;
    await prisma.$connect();

    const isUser = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!isUser) {
      return NextResponse.json({
        error: "user not found",
      });
    }

    const cart = await prisma.cart.create({
      data: {
        userId,
        totalPrice,
        items: {
          create: items?.map((cartitem) => ({
            prodcutId: cartitem.productId,
            quantity: cartitem.quantity,
            imageUruploadedCoverImagel: cartitem.imageUruploadedCoverImagel,
          })),
        },
      },
    });

    return NextResponse.json({
      message: "cart created succesfully",
      status: 200,
      data: cart,
    });
  } catch (error) {
    return NextResponse.json({
      detail: error,
      status: 500,
    });
  } finally {
    await prisma.$disconnect();
  }
}
