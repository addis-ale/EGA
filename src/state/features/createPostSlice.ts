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
  coverImage: z
    .instanceof(File)
    .refine((file) => !!file, {
      message: "Cover image is required.",
    })
    .optional(), // Optional, user might not upload immediately
  video: z
    .instanceof(File)
    .refine((file) => !!file, {
      message: "Video is required.",
    })
    .optional(), // Optional for video
});

type ProductState = z.infer<typeof productSchema>;

// Initial state with empty values
const initialState: ProductState = {
  productName: "",
  productDescription: "",
  coverImage: undefined,
  video: undefined,
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
      state.coverImage = action.payload.coverImage;
      state.video = action.payload.video;
    },

    // Reset state to its initial values
    resetProduct: (state) => {
      state.productName = "";
      state.productDescription = "";
      state.coverImage = undefined;
      state.video = undefined;
    },
  },
});

// Export actions to be used in components
export const { updateProduct, resetProduct } = createPostSlice.actions;

// Export the reducer to be added to the Redux store
export default createPostSlice.reducer;
