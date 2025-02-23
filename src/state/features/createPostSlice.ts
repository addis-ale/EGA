import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { z } from "zod";

// Define validation for the product schema
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const productSchema = z.object({
  productName: z
    .string()
    .min(3, "Product name must contain at least 3 characters")
    .max(50, "Product name can't be longer than 50 characters")
    .default(""),

  productDescription: z
    .string()
    .min(50, "Product description must contain at least 50 characters")
    .default(""),

  uploadedVideo: z.string().default(""),
  uploadedCoverImage: z.string().default(""),

  price: z.number().min(0, "Price must be a positive number").default(0),

  discountPercentage: z
    .number()
    .min(0, "Discount must be positive")
    .max(100, "Discount cannot exceed 100%")
    .default(0),

  ageRestriction: z
    .enum(["all", "13", "15", "18"], {
      required_error: "Please select an age restriction",
    })
    .default("all"),

  gameType: z
    .string()
    .min(1, "Please select a game type")
    .default("Table Game"),

  availableProduct: z
    .number()
    .int()
    .min(1, "Available product must be at least one")
    .default(1),
});

type ProductState = z.infer<typeof productSchema>;

// Initial state using inferred Zod defaults
const initialState: ProductState = {
  productName: "",
  productDescription: "",
  uploadedCoverImage: "",
  uploadedVideo: "",
  discountPercentage: 0,
  ageRestriction: "all",
  gameType: "Table Game",
  availableProduct: 0,
  price: 0,
};

// Create the slice
export const createPostSlice = createSlice({
  name: "createPost",
  initialState,
  reducers: {
    // Update product data in the Redux state (only update provided fields)
    updateProduct: (state, action: PayloadAction<Partial<ProductState>>) => {
      return { ...state, ...action.payload };
    },

    // Reset state to its initial values
    resetProduct: () => initialState,
  },
});

// Export actions to be used in components
export const { updateProduct, resetProduct } = createPostSlice.actions;

// Export the reducer to be added to the Redux store
export default createPostSlice.reducer;
