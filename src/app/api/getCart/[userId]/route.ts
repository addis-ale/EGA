import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { ZodError, z } from "zod";
// import { getToken } from "next-auth/jwt";
const userIdSchema = z.object({
  userId: z.string(),
});
export async function GET(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  req: any,
  context: { params: { userId: string } }
) {
  try {
    // const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    // console.log(token);
    // if (!token) {
    //   return NextResponse.json({
    //     error: "Unauhthorized",
    //     status: 401,
    //   });
    // }
    // const userId = token.id;
    const { params } = context;
    const { userId } = params;
    const validation = userIdSchema.safeParse(userId);
    if (!validation.success) {
      return NextResponse.json({
        error: validation.error.flatten().fieldErrors,
        status: 422,
      });
    }
    const getUser = await prisma.user.findMany({
      where: { id: userId },
    });
    if (!getUser) {
      return NextResponse.json({
        error: "User Not found!",
        status: 409,
      });
    }
    const getUserData = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        cart: true,
        order: true,
      },
    });

    if (!getUserData) {
      return NextResponse.json({
        message: "User have no order and cart",
      });
    }
    return NextResponse.json({
      message: "user data sent",
      data: getUserData,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({
        error: error.message,
        status: 409,
      });
    }
    if (error instanceof ZodError) {
      return NextResponse.json({
        erro: error.flatten().fieldErrors,
        status: 409,
      });
    }
    return NextResponse.json({
      error: "server error",
      status: 500,
    });
  }
}
