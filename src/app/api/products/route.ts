import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
// import { productSchema } from "@/schemas/productSchema";
import { Prisma } from "@prisma/client";
// import { z } from "zod";

// GET ALL PRODUCTS OR FILTER BY CATEGORY, SEARCH, AND PAGINATION
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const skip = (page - 1) * limit;

    const whereClause: Prisma.ProductWhereInput = {};

    // Apply category filtering
    if (category) {
      if (category === "trending") {
        whereClause.views = { gte: 1 }; // Trending products (most viewed)
      } else if (category === "top-rated") {
        //TODO: Add rating table to my database
        //   whereClause.rating = { gte: 4 }; // Only high-rated products
      } else if (category === "recommended") {
        //TODO: Add rating table to my database
        //  whereClause.isRecommended = true;
      } else if (category === "deal-of-the-week") {
        whereClause.discountPercentage = { gt: 0 };
      }
    }

    // Apply search filter
    if (search) {
      whereClause.OR = [
        { productName: { contains: search, mode: "insensitive" } },
        { productDescription: { contains: search, mode: "insensitive" } },
      ];
    }

    // Fetch products
    const products = await prisma.product.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { views: "desc" }, // Newest first
    });

    // Get total count for pagination
    const total = await prisma.product.count({ where: whereClause });
    return NextResponse.json({ products, total, page, limit });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// // CREATE A NEW PRODUCT
// export async function POST(req: Request) {
//   try {
//     // TODO: Protect non-admin users
//     const product = await req.json();
//     const validatedProduct = productSchema.parse(product);
//     const { availableProduct: available, ...other } = validatedProduct;
//     const newProduct = await prisma.product.create({
//       data: other,
//     });

//     return NextResponse.json(
//       { message: "Successfully created product", product: newProduct },
//       { status: 201 }
//     );
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       return NextResponse.json(
//         { error: "Invalid input data", details: error.errors },
//         { status: 400 }
//       );
//     }

//     console.error("Error creating product:", error);
//     return NextResponse.json(
//       { error: "Failed to create product" },
//       { status: 500 }
//     );
//   }
// }
