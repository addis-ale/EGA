import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { z } from "zod";
import { getCurrentUser } from "@/actions/getCurrentUser";

const orderItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().min(1, "at least one item"),
  price: z.number().min(1, "price must greater than 1"),
});

const orderSchema = z.object({
  // userId: z.string().min(1, "user id require"),
  orderItem: z.array(orderItemSchema),
  totalPrice: z.number().min(0, "price must be positive"),
  // paymentMethod: z.enum(["TeleBirr", "PickUp"]),
  status: z.enum(["SHIPPED", "PENDING", "COMPLETED", "CANCELED"]),
});

async function getAuthentication() {
  const user = await getCurrentUser();
  console.log(user);
  if (!user?.id) {
    throw new Error("unauhtorized!");
  }
  return user.id;
}

export default async function POST(req: Request) {
  try {
    const userId = await getAuthentication();
    console.log(userId);
    const { cart_id, paymentMethod } = await req.json();
    const orderTotalPrice = await prisma.cart.findFirst({
      where: { id: cart_id },
      select: { totalPrice: true },
    });

    const orderItemAdd = await prisma.cartItem.findMany({
      where: { cartId: cart_id },
    });
    if (!orderItemAdd) {
      return NextResponse.json({
        msg: "item not found",
        status: 404,
      });
    }
    const validation = orderSchema.safeParse({
      totalPrice: orderTotalPrice?.totalPrice,
      orderItem: orderItemAdd.map((item) => ({
        productId: item.productId,
        quantity: Number(item?.quantity),
        price: Number(item.price),
      })),
    });

    const body = await req.json();
    console.log(body);

    if (!validation.success) {
      return NextResponse.json({
        error: validation.error.format(),
        status: 422,
      });
    }
    const { orderItem, status, totalPrice } = validation.data;

    await prisma.$connect();
    const order = await prisma.order.create({
      data: {
        userId,
        status,
        totalPrice,
        paymentMethod,
        orderItem: {
          create: orderItem?.map((order) => ({
            productId: order.productId,
            quantity: order.quantity,
            price: order.price,
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
