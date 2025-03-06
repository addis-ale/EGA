import { z } from "zod";

export const productSchema = z
  .object({
    productName: z.string().min(1, "Product name is required"),
    productDescription: z
      .string()
      .min(10, "Description must be at least 10 characters"),
    uploadedCoverImage: z.string().url("Invalid image URL"),
    discountPercentage: z
      .number()
      .min(0, "Discount cannot be negative")
      .max(100, "Discount cannot exceed 100%")
      .optional(),

    ageRestriction: z.string().min(0, "Age restriction is required"),
    gameType: z.string().min(1, "Game type is required"),

    // Stock Availability
    availableForSale: z
      .number()
      .min(0, "Available products for sale cannot be negative")
      .optional(),
    availableForRent: z
      .number()
      .min(0, "Available products for rent cannot be negative")
      .optional(),

    productType: z.enum(["SALE", "RENT", "BOTH"]).default("SALE"),

    // Pricing Details
    pricing: z.object({
      salePrice: z
        .number()
        .min(0, "Sale price must be a positive number")
        .optional(),
      rentalPricePerHour: z
        .number()
        .min(0, "Rental price per hour must be a positive number")
        .optional(),
      minimumRentalPeriod: z
        .number()
        .min(1, "Minimum rental period must be at least 1 hour/day")
        .optional(),
      maximumRentalPeriod: z
        .number()
        .min(1, "Maximum rental period must be at least 1 hour/day")
        .optional(),
    }),

    uploadedVideo: z.object({
      setUp: z.string().url("Invalid video URL"),
      actionCard: z.string().url("Invalid video URL"),
      gamePlay: z.string().url("Invalid video URL"),
    }),
  })
  .refine(
    (data) => {
      if (
        data.pricing.salePrice === undefined &&
        data.pricing.rentalPricePerHour === undefined
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Either salePrice or rentalPricePerHour must be provided",
      path: ["pricing"],
    }
  )
  .refine(
    (data) => {
      if (
        data.availableForRent &&
        data.pricing.minimumRentalPeriod !== undefined &&
        data.pricing.maximumRentalPeriod !== undefined &&
        data.pricing.minimumRentalPeriod > data.pricing.maximumRentalPeriod
      ) {
        return false;
      }
      return true;
    },
    {
      message:
        "Minimum rental period cannot be greater than the maximum rental period",
      path: ["pricing"],
    }
  );
