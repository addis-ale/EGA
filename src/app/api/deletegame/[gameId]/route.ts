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
export async function DELETE(
  req: Request,
  context: { params: { gameId: string } }
) {
  try {
    const userId = await getAuthenticatedUser();

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    const role = user?.role;

    if (!role || role !== "ADMIN") {
      return NextResponse.json({
        msg: "unahutorized",
      });
    }

    const { params } = context;
    const { gameId } = params;

    if (!gameId) {
      return NextResponse.json({
        error: "game id required to delete",
        status: 409,
      });
    }
    await prisma.$connect().catch((error) => {
      throw new Error("db connection failed", error);
    });
    await prisma.product.delete({
      where: { id: gameId },
    });
    return NextResponse.json({
      message: "game deleted",
      status: 200,
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
  } finally {
    await prisma.$disconnect();
  }
}
