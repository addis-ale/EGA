import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(
  req: Request,
  context: { params: { gameId: string } }
) {
  try {
    const { params } = context;
    console.log(params);
    const { gameId } = params;
    console.log(gameId);

    if (!gameId) {
      return NextResponse.json({
        message: "game id need",
        status: 400,
      });
    }
    console.log(gameId);

    const getGame = await prisma.product.findUnique({
      where: { id: gameId },
      include: {
        review: true,
        availableProduct: true,
      },
    });
    const updategame = await prisma.product.update({
      where: { id: gameId },
      data: {
        views: (getGame?.views || 0) + 1,
      },
    });
    console.log(updategame);
    console.log(getGame);
    if (!getGame)
      return NextResponse.json({
        error: "game not found",
      });

    return NextResponse.json({
      message: "return game",
      data: updategame,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({
        error: error.message,
        status: 500,
      });
    }

    return NextResponse.json({
      message: "server error",
      status: 500,
    });
  } finally {
    await prisma.$disconnect();
  }
}
