import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import AddOrder from "src/service/order";
export async function POST(req: Request) {
  const data = await req.json();
  const { cart_id, status, paymentMethod } = data;
  if (!cart_id) {
    return NextResponse.json({
      msg: "cart_id need",
      status: 403,
    });
  }

  await prisma.cart.update({
    where: { id: cart_id },
    data: {
      paymentStatus: status === "SUCCESS" ? "Paid" : "failed",
    },
  });
  if (status === "SUCCESS") {
    const addorder = await AddOrder({
      cart_id,
      paymentMethod: paymentMethod,
    });
    if (!addorder) {
      return NextResponse.json({
        msg: "error on adding order",
        status: 401,
      });
    }
    const orderItemAdd = await prisma.cartItem.findMany({
      where: { cartId: cart_id },
    });
    if (!orderItemAdd) {
      return NextResponse.json({
        msg: "no item in the cart",
        status: 404,
      });
    }
    // for (const item of orderItemAdd) {
    //   const ITEM = await prisma.available.findUnique({
    //     where: { gameId: item.productId },
    //   });
    //   if (!ITEM) {
    //     return NextResponse.json({
    //       msg: "item cant find",
    //       status: 404,
    //     });
    //   }
    //   const ITEMNUMBER = ITEM?.availableProduct;
    //   if (ITEMNUMBER < item.quantity) {
    //     return NextResponse.json({
    //       msg: `Not enough stock for product ${item.productId}`,
    //     });
    //   }
    //   await prisma.available.update({
    //     where: { id: ITEM?.id },
    //     data: {
    //       availableProduct: ITEMNUMBER - item.quantity,
    //     },
    //   });
    // }

    await prisma.$transaction(
      orderItemAdd.map((item) =>
        prisma.product.update({
          where: {
            id: item.productId,
          },
          data: {
            availableForSale:
              item.salesType === "sale"
                ? {
                    decrement: item.quantity,
                  }
                : {
                    increment: 0,
                  },
            availableForRent:
              item.salesType === "Rent"
                ? {
                    decrement: item.quantity,
                  }
                : {
                    increment: 0,
                  },
          },
        })
      )
    );

    await prisma.cart.delete({
      where: { id: cart_id },
    });

    return NextResponse.json({
      msg: "order added",
      data: "order created",
    });
  }
}
