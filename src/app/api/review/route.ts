import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { z, ZodError } from "zod";

const reviewSchema = z.object({
  userId: z.string().min(1, "user id needed"),
});
export async function POST(req: Request) {
  try {
    console.log(req);
    reviewSchema.safeParse(req.body);
    await prisma.$connect().catch((error) => {
      throw new Error("db conection " + error);
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
        error: error.flatten().fieldErrors,
        status: 403,
      });
    }
    return NextResponse.json({
      error: "server error",
      status: 500,
    });
  }
}
