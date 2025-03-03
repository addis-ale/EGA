import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

import { getCurrentUser } from "@/actions/getCurrentUser";
async function getAuthenticatedUser() {
  const user = await getCurrentUser();
  if (!user?.id) {
    throw new Error("User not authenticated");
  }
  return user.id;
}
export async function GET(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  req: any,
  context: { params: { userId: string } }
) {
  try {
    console.log(req, context);
    const userId = await getAuthenticatedUser();

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
