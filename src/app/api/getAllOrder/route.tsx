import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import prisma from "@/lib/prismadb";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(req: any) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.json({
        message: "denied to access",
        status: 403,
      });
    }
    const userRoll = token.role;
    if (userRoll !== "ADMIN") {
      return NextResponse.json({
        error: "unahutorized",
        status: 403,
      });
    }
    await prisma.$connect().catch((error) => {
      throw new Error("Db connection failed" + error);
    });
    const getAllOrder = await prisma.order.findMany();

    if (!getAllOrder) {
      return NextResponse.json({
        message: "there is no order",
      });
    }     
    return NextResponse.json({
      message: "the order is sent",
      status: 200,
      data: getAllOrder,
    });
  } catch (error) {
    return NextResponse.json({
      error: "server error " + error,
      status: 500,
    });
  }
}
