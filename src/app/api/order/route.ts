import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { z } from "zod";

const orderItemSchema = z.object({
  orderId: z.string().min(1, "order id needed").optional(),
  productId: z.string().min(1, "product id needed"),
  quantity: z.number().int().min(1, "at least one item"),
  price: z.number().min(0, "price must be positive"),
});

const orderSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().min(1, "user id require"),
  orderItem: z.array(orderItemSchema),

  status: z.enum(["SHIPED", "PENDING", "COMPLETED", "CANCELED"]),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log(body);
    const validation = orderSchema.safeParse({
      ...body,
      orderItem: body.orderItem?.map((order: any) => ({
        ...order,
        quantity: Number(order.quantity),
        price: Number(order.price),
        productId: order.productId,
      })),
    });

    if (!validation.success) {
      return NextResponse.json({
        error: validation.error.format(),
        status: 422,
      });
    }

    const { userId, orderItem } = validation.data;

    const order = await prisma.order.create({
      data: {
        userId,
        status: "PENDING",
        orderItem: {
          create: orderItem?.map((order) => ({
            productId: order.productId,
            price: order.price,
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
