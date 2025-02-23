import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { z } from "zod";

// Define validation for the product schema
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const productSchema = z.object({
  productName: z
    .string()
    .min(3, "Product name must contain at least 3 characters")
    .max(50, "Product name can't be longer than 50 characters")
    .optional(),
  productDescription: z
    .string()
    .min(50, "Product description must contain at least 50 characters")
    .optional(),
  // Allow file objects in the state (using `File` type)
  videoUrl: z.string(),
  imageUrl: z.string(),
  price: z.number().min(0, "Price must be posetive number"),

  discountPercentage: z
    .number()
    .min(0, "Discount must be positive")
    .max(100, "Discount cannot exceed 100%"),

  ageRestriction: z.enum(["all", "13", "15", "18"], {
    required_error: "Please select an age restriction",
  }),
  gameType: z.string().min(1, "Please select a game type"),
  availableProduct: z
    .number()
    .int()
    .min(1, "Available product must be a atleast one"),
});

type ProductState = z.infer<typeof productSchema>;

// Initial state with empty values
const initialState: ProductState = {
  productName: "",
  productDescription: "",
  imageUrl: "",
  videoUrl: "",
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
    // Update the product data in the Redux state
    updateProduct: (state, action: PayloadAction<ProductState>) => {
      state.productName = action.payload.productName;
      state.productDescription = action.payload.productDescription;
      state.imageUrl = action.payload.imageUrl;
      state.videoUrl = action.payload.videoUrl;
      state.price = action.payload.price;
      state.discountPercentage = action.payload.discountPercentage;
      state.ageRestriction = action.payload.ageRestriction;
      state.availableProduct = action.payload.availableProduct;
      state.gameType = action.payload.gameType;
    },

    // Reset state to its initial values
    resetProduct: (state) => {
      state.productName = "";
      state.productDescription = "";
      state.imageUrl = "";
      state.videoUrl = "";
      state.price = 0;
      state.discountPercentage = 0;
      state.ageRestriction = "all";
      state.gameType = "Table Game";
      state.availableProduct = 1;
    },
  },
});

// Export actions to be used in components
export const { updateProduct, resetProduct } = createPostSlice.actions;

// Export the reducer to be added to the Redux store
export default createPostSlice.reducer;
