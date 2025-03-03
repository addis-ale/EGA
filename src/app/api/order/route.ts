import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { z } from "zod";
import { getCurrentUser } from "@/actions/getCurrentUser";

const orderItemSchema = z.object({
  id: z.string().uuid().optional(),
  quantity: z.number().int().min(1, "at least one item"),
  cartId: z.string(),
});

const orderSchema = z.object({
  // userId: z.string().min(1, "user id require"),
  orderItem: z.array(orderItemSchema),
  totalPrice: z.number().min(0, "price must be positive"),
  paymentMethod: z.enum(["TeleBirr"]),
  status: z.enum(["SHIPED", "PENDING", "COMPLETED", "CANCELED"]),
});

async function getAuthentication() {
  const user = await getCurrentUser();
  if (!user?.id) {
    throw new Error("unauhtorized!");
  }
  return user.id;
}

export async function POST(req: Request) {
  try {
    const userId = await getAuthentication();

    const body = await req.json();
    console.log(body);
    const validation = orderSchema.safeParse({
      ...body,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      orderItem: body.orderItem?.map((order: any) => ({
        ...order,
        quantity: Number(order.quantity),
        totalPrice: Number(order.totalPrice),
      })),
    });
    if (!validation.success) {
      return NextResponse.json({
        error: validation.error.format(),
        status: 422,
      });
    }
    const { orderItem, totalPrice, paymentMethod, status } = validation.data;

    const isUserOrder = await prisma.order.findUnique({
      where: { userId },
      include: {
        orderItem: true,
      },
    });
    if (isUserOrder) {
      for (const order of orderItem) {
        const isItem = await prisma.orderItem.findUnique({
          where: { productId: order.id },
        });

        if (isItem) {
          return NextResponse.json({
            msg: "item already exit",
            status: 200,
          });
        }
        const order = await prisma.orderItem.createMany({
          data: {
            orderId: isUserOrder.id,
          },
        });
      }
    }
    await prisma.$connect();
    const order = await prisma.order.create({
      data: {
        userId,
        status,
        totalPrice,
        paymentMethod,
        orderItem: {
          create: orderItem?.map((order) => ({
            quantity: order.quantity,
          })),
        },
      },
    });

    return NextResponse.json({
      message: "ordered succesfully",
      status: 200,
      data: order,
    });
  } catch (error) {
    return NextResponse.json({
      error: "An error occurred while processing your order.",
      details: error instanceof Error ? error.message : error,
      status: 500,
    });
  }
}
