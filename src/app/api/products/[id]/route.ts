import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { productSchema } from "@/schemas/productSchema";

// GET SINGLE PRODUCT BY ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params || {}; // Safely destructure with fallback
  try {
    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        views: (product.views || 0) + 1,
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
//UPDATE PRODUCT BY ID
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  //TODO: protect non-admin user
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { error: "Product ID is required" },
      { status: 400 }
    );
  }

  try {
    // Check if the product exists
    const productExists = await prisma.product.findUnique({ where: { id } });
    if (!productExists) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Parse the incoming request body to get the updated product data
    const productData = await req.json();
    const validatedProduct = productSchema.parse(productData);
    // Update the product in the database
    const updatedProduct = await prisma.product.update({
      where: { id }, // Find the product by ID
      data: validatedProduct, // Use the incoming data to update the product
    });

    return NextResponse.json(
      { message: "Product updated successfully", product: updatedProduct },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE PRODUCT BY ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  //TODO: Protect non-admin users
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { error: "Product ID is required" },
      { status: 400 }
    );
  }

  try {
    // Check if the product exists before attempting to delete
    const productExists = await prisma.product.findUnique({
      where: { id },
    });

    if (!productExists) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Attempt to delete the product by ID
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    // Log the error and return a server-side error response
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
