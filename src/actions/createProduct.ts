import { productSchema } from "@/schemas/productSchema"; // Import Zod schema
import { z } from "zod";

export const createProduct = async (data: unknown) => {
  try {
    // Validate input using Zod
    const validatedData = productSchema.parse(data);
    const response = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validatedData),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    return await response.json(); // Return the created product
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation Error:", error.errors);
      return {
        success: false,
        error: "Invalid input data",
        details: error.errors,
      };
    }

    console.error("Failed to create product:", error);
    return { success: false, error: (error as Error).message };
  }
};
