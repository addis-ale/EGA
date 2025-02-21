import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { hashSync } from "bcrypt";

import { z, ZodError } from "zod";
const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, email, password } = signUpSchema.parse(body);
    const existedUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existedUser) {
      return NextResponse.json(
        {
          user: null,
          message: "User already exist!",
        },
        { status: 409 }
      );
    }
    const hashedPassword = hashSync(password, 10);
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hashedPassword: newUserPassword, ...rest } = newUser;
    return NextResponse.json(
      {
        user: rest,
        message: "User created Successfully!",
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({
        error: JSON.stringify({ errors: error.flatten().fieldErrors }),
      });
    } else if (error instanceof Error) {
      return NextResponse.json(
        {
          error: error.message,
          message: "Something went wrong",
        },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Unknown error", message: "Something went wrong" },
      { status: 500 }
    );
  }
}
