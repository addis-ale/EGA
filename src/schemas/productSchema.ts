import { z } from "zod";
export const productSchema = z.object({
  productName: z.string().min(1, "Product name is required"),
  productDescription: z
    .string()
    .min(10, "Description must be at least 10 characters"),
  uploadedCoverImage: z.string().url("Invalid image URL"),

  discountPercentage: z
    .number()
    .min(0, "Discount cannot be negative")
    .max(100, "Discount cannot exceed 100%"),
  ageRestriction: z.number().min(0, "Age restriction cannot be negative"),
  gameType: z.string().min(1, "Game type is required"),
  availableProduct: z.number().min(0, "Available products cannot be negative"),
  price: z.number().min(0, "Price must be a positive number"),
});
