import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { z } from "zod";

// Define validation schema using Zod
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const productSchema = z.object({
  productName: z
    .string()
    .min(3, "Product name must contain at least 3 characters")
    .max(50, "Product name can't be longer than 50 characters"),
  productDescription: z
    .string()
    .min(50, "Product description must contain at least 50 characters"),
});
type ProductState = z.infer<typeof productSchema>;

// Initial state
const initialState: ProductState = {
  productName: "",
  productDescription: "",
};

// Create the slice
export const createPostSlice = createSlice({
  name: "createPost",
  initialState,
  reducers: {
    // Update both productName and productDescription in one action
    updateProduct: (state, action: PayloadAction<ProductState>) => {
      state.productName = action.payload.productName;
      state.productDescription = action.payload.productDescription;
    },
  },
});

// ✅ Export actions to be used in components
export const { updateProduct } = createPostSlice.actions;

// ✅ Export reducer to be added to the Redux store
export default createPostSlice.reducer;
