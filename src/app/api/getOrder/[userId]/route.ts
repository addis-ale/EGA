import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

// import { getToken } from "next-auth/jwt";
import { getCurrentUser } from "@/actions/getCurrentUser";

export async function GET(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  req: any,
  context: { params: { userId: string } }
) {
  try {
    // const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const user = getCurrentUser();
    if (!user) {
      console.log("user cant found");
    }
    // console.log(user);
    // if (!token) {
    //   return NextResponse.json({
    //     message: "user not found",
    //     status: 403,
    //   });
    // }

    // const userId = token.id;
    // if (!userId) {
    //   return NextResponse.json({ message: "user id required" });
    // }
    const { params } = context;
    const { userId } = params;
    const getUser = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!getUser) {
      return NextResponse.json({
        message: "user not found",
      });
    }

    const getUserData = await prisma.user.findMany({
      where: { id: userId },
      include: {
        order: true,
      },
    });
    if (!getUserData) {
      return NextResponse.json({
        message: "user have not order yet",
      });
    }
    return NextResponse.json({
      message: "user order send",
      status: 200,
      getUserData,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({
        error: error.message,
        status: 409,
      });
    }
    return NextResponse.json({
      error: "server error",
      status: 500,
    });
  }
}
