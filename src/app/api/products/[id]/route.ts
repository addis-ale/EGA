import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    // Use a transaction to fetch and update in one operation
    const [updatedProduct] = await prisma.$transaction([
      prisma.product.update({
        where: { id },
        data: { views: { increment: 1 } }, // Increment views safely
        include: {
          priceDetails: true,
          uploadedVideo: true,
          reviews: true,
        },
      }),
    ]);

    if (!updatedProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ product: updatedProduct }, { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    // Check if the product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // Delete related price details first (if applicable)
    await prisma.priceDetails.deleteMany({
      where: { productId: id },
    });

    // Delete the product
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json(
      { success: true, message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    // Validate incoming data (Partial update)
    const validatedData = body;

    // Check if the product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // Extract price details if they exist
    const { pricing, uploadedVideo, ...productUpdates } = validatedData;

    // Update the product
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: productUpdates,
    });

    let updatedPriceDetails = null;
    let updatedVidieo = null;

    // If pricing details are provided, update them
    if (pricing) {
      updatedPriceDetails = await prisma.priceDetails.updateMany({
        where: { productId: id },
        data: pricing,
      });
    }
    if (uploadedVideo) {
      updatedVidieo = await prisma.videoUploaded.updateMany({
        where: { productId: id },
        data: uploadedVideo,
      });
    }

    return NextResponse.json(
      {
        success: true,
        product: updatedProduct,
        priceDetails: updatedPriceDetails,
        uploadedVideo: updatedVidieo,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error:", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
