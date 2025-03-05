import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { z } from "zod";
async function getAuthenticatedUser() {
  const user = await getCurrentUser();
  if (!user?.id) {
    throw new Error("user Not found");
  }
  return user.id;
}
const rentSchema = z.object({
  productId: z.string(),
  rentalEnd: z.string(),
});

export async function POST(req: Request) {
  try {
    const userId = await getAuthenticatedUser();
    const body = await req.json();

    const { productId, rentalEnd } = body;
    const validation = rentSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({
        error: validation.error.flatten().fieldErrors,
        status: 403,
      });
    }

    const rent = await prisma.rental.create({
      data: {
        userId: userId,
        rentalStart: new Date(),
        productId: productId,
        rentalEnd: new Date(rentalEnd),
        status: status,
      },
    });

    if (!rent) {
      return NextResponse.json({
        msg: "cant create rent",
      });
    }
    return NextResponse.json({
      msg: "rent created",
      status: 201,
      rent,
    });
  } catch (error) {
    return NextResponse.json({
      msg: "server error" + error,
      status: 500,
    });
  }
}
