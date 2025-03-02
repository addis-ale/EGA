import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { hashSync } from "bcryptjs";

import { z, ZodError } from "zod";
const signUpSchema = z.object({
  userName: z.string().min(2, "Name must be at least 2 characters"),
  UserEmail: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log(body);
    if (!body) {
      return NextResponse.json({
        error: "user credintial object needed",
      });
    }
    const { userName, UserEmail, password } = signUpSchema.parse(body);
    console.log(userName, UserEmail, password);
    if (!userName || !UserEmail || !password) {
      return NextResponse.json({
        error: "cant parse credintial from zod",
        data: {
          userName,
          UserEmail,
        },
      });
    }
    await prisma.$connect().catch((error) => {
      throw new Error("db connection error" + error);
    });

    const existedUser = await prisma.user.findUnique({
      where: { UserEmail },
    });
    console.log(existedUser);
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
        userName,
        UserEmail,
        password: hashedPassword,
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: newUserPassword, ...rest } = newUser;
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
          detial: error.message,
        },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Unknown error", message: "Something went wrong" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
