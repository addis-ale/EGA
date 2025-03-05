import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { z, ZodError } from "zod";

const userIdSchema = z.object({
  userId: z.string(),
});
export async function GET(
  req: Request,
  context: { params: { userId: string } }
) {
  try {
    console.log(req);
    const { params } = context;
    const { userId } = params;
    const validation = userIdSchema.safeParse(userId);
    if (!validation.success) {
      return NextResponse.json({
        error: validation.error.flatten().fieldErrors,
        status: 409,
      });
    }

    const getUser = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!getUser) {
      return NextResponse.json({
        error: "User Not found!",
        status: 409,
      });
    }

    const recommend = await prisma.searchHistory.findUnique({
      where: { userId: userId },
      include: { search: true },
    });
    if (!recommend) {
      return NextResponse.json({
        message: "user have not search history",
      });
    }
    console.log(recommend);
    return NextResponse.json({
      message: "user search fetch",
      history: recommend.search,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({
        error: error.message,
        status: 422,
      });
    }
    if (error instanceof ZodError) {
      return NextResponse.json({
        error: error.flatten().fieldErrors,
        status: 405,
      });
    }
    return NextResponse.json({
      error: "Server Error",
      status: 500,
    });
  }
}
