import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { getCurrentUser } from "@/actions/getCurrentUser";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(req: any) {
  try {
    console.log(req);

    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({
        msg: "denied access",
      });
    }
    console.log(session + "session is");
    if (session.role !== "ADMIN") {
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
