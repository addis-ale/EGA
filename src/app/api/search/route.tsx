import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { z, ZodError } from "zod";

const searchSchama = z.object({
  priceRange: z.string().optional(),
  publishedAt: z.enum(["Today", "Last week", "Last month"]).optional(),
  age: z.string().optional(),
  alphabet: z.string().optional(),
  userId: z.string().nullable(),
  type: z.enum(["TABLE_TOP", "PHYSICAL"]).optional(),
});

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const {
      priceRange,
      publishedAt,
      age,
      alphabet,
      userId,
      searchQuery,
      type,
    } = Object.fromEntries(url.searchParams);
    const validation = searchSchama.safeParse({
      priceRange,
      publishedAt,
      age,
      alphabet,
      searchQuery,
      userId,
      type,
    });
    if (!validation.success) {
      return NextResponse.json({
        error: validation.error.flatten().fieldErrors,
        status: 409,
      });
    }

    let publishedData;

    if (publishedAt) {
      if (publishedAt === "Today") {
        publishedData = new Date();
        publishedData.setHours(0, 0, 0, 0);
      }
      if (publishedAt === "Last week") {
        publishedData = new Date();
        publishedData.setDate(publishedData.getDate() - 7);
      }
      if (publishedAt === "Last month") {
        publishedData = new Date();
        publishedData.setDate(publishedData.getMonth() - 1);
      }
    }

    console.log(publishedData);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filters: any = {};
    const gameNameFilter = [];
    if (searchQuery) {
      gameNameFilter.push({ contains: searchQuery, mode: "insensitive" });
    }
    if (alphabet) {
      gameNameFilter.push({ contains: alphabet, mode: "insensitive" });
    }
    if (gameNameFilter.length > 0) {
      filters.OR = gameNameFilter;
    }
    if (type) {
      filters.type = type;
    }

    if (priceRange) {
      const [minValue, maxValue] = priceRange.split("-").map(Number);
      filters.price = { gte: minValue, lte: maxValue };
    }
    if (publishedData) {
      filters.createdAt = { gte: publishedData };
    }
    if (age) {
      filters.ageLimit = Number(age);
    }
    await prisma.$connect().catch((error) => {
      throw new Error(error);
    });
    const resultGame = await prisma.game.findMany({
      where: filters,
      orderBy: { createdAt: "desc" },
    });

    await prisma.searchHistory.create({
      data: {
        userId: userId,
        search: {
          create: { searchQuery: searchQuery },
        },
      },
    });
    return NextResponse.json({
      message: "success",
      resultGame: resultGame,
      status: 200,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({
        error: error.message,
        status: 403,
      });
    }
    if (error instanceof ZodError) {
      return NextResponse.json({
        error: error.flatten().fieldErrors,
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
