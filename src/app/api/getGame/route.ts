import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const gameId = url.searchParams.get("gameId");

    if (!gameId) {
      return NextResponse.json({
        message: "game id need",
        status: 400,
      });
    }
    console.log(gameId);

    await prisma.$connect().catch((error) => {
      throw new Error("db conection problem", error);
    });

    const getGame = await prisma.game.findUnique({
      where: { id: gameId.toString() },
      include: {
        review: true,
      },
    });

    // const getGame = await Promise.race([
    //   gamePromise,
    //   setTimeout((_, reject) => reject(new Error("time out ,finshed")), 10000),
    // ]);

    console.log(getGame);
    if (!getGame)
      return NextResponse.json({
        error: "game not found",
      });

    return NextResponse.json({
      message: "return game",
      data: getGame,
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
