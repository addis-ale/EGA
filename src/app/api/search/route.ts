import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { z, ZodError } from "zod";
import { getCurrentUser } from "@/actions/getCurrentUser";

const searchSchama = z.object({
  priceRange: z.string().optional(),
  publishedAt: z.enum(["Today", "Last week", "Last month"]).optional(),
  age: z.string().optional(),
  alphabet: z.string().optional(),
  type: z.string().min(1, "need type").optional(),
  limit: z.number(),
  page: z.number(),
});
async function getAuth() {
  const userId = await getCurrentUser();
  if (!userId?.id) {
    return null;
  }
  return userId.id;
}
export async function GET(req: Request) {
  try {
    const userId = await getAuth();
    // const userId = "67c97c4ca3134a2afdd4139a";
    const url = new URL(req.url);
    // "price" | "published" | "alphabet" | "age" | "other"
    const {
      price: priceRange,
      published: publishedAt,
      // age,
      // alphabet,
      searchQuery,
      type,
      // eslint-disable-next-line prefer-const

      limit,
      // eslint-disable-next-line prefer-const

      page,
    } = Object.fromEntries(url.searchParams);
    const validation = searchSchama.safeParse({
      priceRange,
      publishedAt,
      // age,
      // alphabet,
      searchQuery,
      userId,
      type,
      limit: Number(limit),
      page: Number(page),
    });
    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    // Ensure valid positive numbers
    const validPage = !isNaN(pageNumber) && pageNumber > 0 ? pageNumber : 1;
    const validLimit =
      !isNaN(limitNumber) && limitNumber > 0 ? limitNumber : 10;

    const skip = (validPage - 1) * validLimit;

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
      gameNameFilter.push({
        productName: { contains: searchQuery, mode: "insensitive" },
      });
    }
    if (searchQuery) {
      gameNameFilter.push({
        productName: { startsWith: searchQuery, mode: "insensitive" },
      });
    }
    if (gameNameFilter.length > 0) {
      if (filters.OR) return;
      filters.OR = gameNameFilter;
    }
    if (type) {
      if (filters.type) return;
      filters.gameType = type;
    }

    if (priceRange) {
      const [minValue, maxValue] = priceRange
        .replace(/[^\d.-]/g, "")
        .split("-")
        .map(Number);
      if (filters.priceDetails) return;
      filters.priceDetails = { salePrice: { gte: minValue, lte: maxValue } };
    }
    if (publishedData) {
      filters.createdAt = { gte: publishedData };
    }
    // if (age) {
    //   filters.ageRestriction = Number(age);
    // }
    await prisma.$connect().catch((error) => {
      throw new Error(error);
    });
    const product = await prisma.product.findMany({
      where: filters,
      include: {
        reviews: true,
        priceDetails: true,
      },
      skip: skip,
      take: Number(limit),
      orderBy: { createdAt: "desc" },
    });
    const totalCount = await prisma.product.count({
      where: filters,
    });
    if (!product || product.length < 1) {
      return NextResponse.json({
        message: "Game can't find",
        product,
      });
    }
    if (userId) {
      const userSearchHistory = await prisma.searchHistory.findUnique({
        where: { userId },
        include: {
          search: true,
        },
      });
      if (!userSearchHistory) {
        await prisma.searchHistory.create({
          data: {
            userId: userId,
            search: {
              create: { searchQuery: searchQuery },
            },
          },
        });
      } else {
        const searchExist = userSearchHistory?.search.find(
          (se) => se.searchQuery === searchQuery
        );

        // const searchExist = await prisma.search.findFirst({
        //   where: { searchQuery },
        // });
        if (!searchExist) {
          await prisma.search.create({
            data: {
              searchHistory: {
                connect: { id: userSearchHistory.id },
              },
              searchQuery,
            },
          });
        }
      }
    }
    const totalPage = totalCount / Number(limit);
    return NextResponse.json({
      message: "success",
      product,
      limit,
      page,
      totalPage,
      totalCount,
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
