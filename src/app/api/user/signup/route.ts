import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { z } from "zod";
const userSchema = z.object({
  id: z.string().uuid().optional(),
  userName: z.string().min(1, "username is required"),
  UserEmail: z.string().email("email is reuired"),
  password: z.string().min(8, "password must be at least 8 character"),
  review: z
    .array(
      z.object({
        id: z.string(),
      })
    )
    .optional(),
  cart: z
    .array(
      z.object({
        id: z.string(),
      })
    )
    .optional(),
  order: z
    .array(
      z.object({
        id: z.string(),
      })
    )
    .optional(),
  search: z
    .array(
      z.object({
        id: z.string(),
      })
    )
    .optional(),
});
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body || typeof body !== "object") {
      return console.log("the body is not object");
    }

    const validation = userSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { errors: validation.error.format() },
        { status: 400 }
      );
    }

    const { UserEmail, password, userName } = validation.data;
    if (!userName || !UserEmail || !password) {
      return NextResponse.json(
        { error: "Invalid input data" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { UserEmail },
    });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        UserEmail,
        password: hashedPassword,
        userName,
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: newPassword, ...rest } = user;
    return NextResponse.json({
      message: "User created successfully",
      user: rest,
      status: 201,
    });
  } catch (error) {
    return NextResponse.json({
      error: "An error occurred while processing your account",
      details: error instanceof Error ? error.message : error,
      status: 500,
    });
  }
}
