import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        priceDetails: true,
      },
    });
    if (products.length === 0) {
      return NextResponse.json({
        msg: "Product empty",
        status: 200,
      });
    }
    return NextResponse.json({
      status: 200,
      products,
    });
  } catch (error) {
    return NextResponse.json({
      msg: "error" + error,
    });
  }
}
