import prisma from "@/lib/prismadb";
import { z } from "zod";
import { getCurrentUser } from "@/actions/getCurrentUser";

const orderItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().min(1, "at least one item"),
  price: z.number().min(1, "price must greater than 1"),
  salesType: z.enum(["Rent", "sale"]),
  datedAt: z.string().optional(),
});

const orderSchema = z.object({
  // userId: z.string().min(1, "user id require"),
  orderItem: z.array(orderItemSchema),
  totalPrice: z.number().min(0, "price must be positive"),
  paymentMethod: z.enum(["TeleBirr", "PickUp"]),
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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const parameter = z.object({
  cart_id: z.string(),
  paymentMethod: z.enum(["TeleBirr", "PickUp"]),
});
type creatOrderProps = z.infer<typeof parameter>;
export default async function AddOrder({
  cart_id,
  paymentMethod,
}: creatOrderProps) {
  try {
    const userId = await getAuthentication();
    console.log(userId);
    const orderTotalPrice = await prisma.cart.findFirst({
      where: { id: cart_id },
      select: { totalPrice: true },
    });

    const orderItemAdd = await prisma.cartItem.findMany({
      where: { cartId: cart_id },
    });
    if (!orderItemAdd) {
      console.log("cart not found");
    }
    const validation = orderSchema.safeParse({
      paymentMethod: paymentMethod,
      totalPrice: orderTotalPrice?.totalPrice,
      orderItem: orderItemAdd.map((item) => ({
        datedAt: item.datedAt,
        salesType: item.salesType,
        productId: item.productId,
        quantity: Number(item?.quantity),
        price: Number(item.price),
      })),
    });

    if (!validation.success) {
      throw new Error("Invalid data");
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
            salesType: order.salesType,
            RentedAt: order.salesType === "Rent" ? new Date() : null,
            datedAt:
              order.salesType === "Rent" && order.datedAt
                ? new Date(order.datedAt)
                : null,
            productId: order.productId,
            quantity: order.quantity,
            price: order.price,
          })),
        },
      },
    });

    return order;
  } catch (error) {
    console.log("error happend" + error);
  }
}
