import { z } from "zod";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/actions/getCurrentUser";
// import { getToken } from "next-auth/jwt";

const cartitemschema = z.object({
  id: z.string(),
  price: z.number(),
  datedAt: z.string(),
  salesType: z.enum(["sale", "Rent", "Both"]),
  quantity: z.number().int().min(1, "at least 1 item required"),
  imageUruploadedCoverImagel: z.string().url(),
});
const cartSchema = z.object({
  // userId: z.string().min(1, "user id required"),
  items: z.array(cartitemschema).optional(),
  totalPrice: z.number().min(1, "price should be postive number"),

  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
async function getAuthenticatedUser() {
  const user = await getCurrentUser();
  if (!user?.id) {
    throw new Error("User not authenticated");
  }
  return user.id;
}
export async function POST(req: Request) {
  try {
    const userId = await getAuthenticatedUser();
    const body = await req.json();
    console.log(body);
    const validation = cartSchema.safeParse({
      ...body,
      totalPrice: Number(body.totalPrice),

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      items: body.items?.map((item: any) => ({
        ...item,
        price: Number(item.price),
        quantity: Number(item.quantity),
      })),
    });

    if (!validation.success) {
      return NextResponse.json({
        message: "Inavlid Input",
        status: 422,
      });
    }
    const { items, totalPrice } = validation.data;
    await prisma.$connect();

    const isUser = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!isUser) {
      return NextResponse.json({
        error: "user not found",
      });
    }
    const isUserhavecart = await prisma.cart.findUnique({
      where: { userId: userId },
      include: {
        items: true,
      },
    });
    if (isUserhavecart) {
      for (const item of items || []) {
        const isItem = await prisma.cartItem.findFirst({
          where: {
            productId: item.id,
            cartId: isUserhavecart.id,
          },
        });

        if (isItem) {
          return NextResponse.json({
            msg: "Item already exists in the cart",
            status: 400,
          });
        }
      }

      if (items && items.length > 0) {
        const newUserItem = await prisma.cartItem.createMany({
          data: items?.map((item) => ({
            salesType: item.salesType,
            RentedAt: item.salesType === "Rent" ? new Date() : null,
            datedAt: item.salesType === "Rent" ? new Date(item.datedAt) : null,
            productId: item.id,
            cartId: isUserhavecart.id,
            price: item.price,
            quantity: item.quantity,
            imageUruploadedCoverImagel: item.imageUruploadedCoverImagel,
          })),
        });
        const totalPrice = items.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );
        await prisma.cart.update({
          where: { id: isUserhavecart.id },
          data: {
            totalPrice: totalPrice + isUserhavecart.totalPrice,
          },
        });
        return NextResponse.json({
          msg: "item added!",
          status: 201,
          newUserItem,
        });
      } else {
        return NextResponse.json("item need to add to cart");
      }
    } else {
      const cart = await prisma.cart.create({
        data: {
          userId,
          totalPrice,
          items: {
            create: items?.map((cartitem) => ({
              productId: cartitem.id,
              salesType: cartitem.salesType,
              RentedAt: cartitem.salesType === "Rent" ? new Date() : null,
              datedAt:
                cartitem.salesType === "Rent"
                  ? new Date(cartitem.datedAt)
                  : null,

              price: cartitem.price,
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
    }
  } catch (error) {
    return NextResponse.json({
      detail: error,
      status: 500,
    });
  } finally {
    await prisma.$disconnect();
  }
}
