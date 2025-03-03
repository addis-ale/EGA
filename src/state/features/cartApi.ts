import { Product } from "@prisma/client";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define API for cart operations
export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Cart"], // Helps with automatic cache invalidation
  endpoints: (builder) => ({
    // ✅ post Cart Items
    addCartItem: builder.mutation<
      { message: string },
      { productId: string; quantity: number }
    >({
      query: ({ productId, quantity }) => ({
        url: "/cart",
        method: "POST",
        body: { productId, quantity },
      }),
      invalidatesTags: ["Cart"], // Refresh cart after update
    }),

    // ✅ Fetch Cart Items
    getCartItems: builder.query<
      { cartItems: Product[]; totalPrice: number },
      void
    >({
      query: () => "/cart",
      providesTags: ["Cart"], // Automatically refresh data when modified
    }),

    // ✅ Update Cart Item (Change Quantity)
    updateCartItem: builder.mutation<
      { message: string },
      { productId: string; quantity: number }
    >({
      query: ({ productId, quantity }) => ({
        url: "/cart",
        method: "PATCH",
        body: { productId, quantity },
      }),
      invalidatesTags: ["Cart"], // Refresh cart after update
    }),

    // ✅ Delete Cart Item
    deleteCartItem: builder.mutation<
      { message: string },
      { productId: string }
    >({
      query: ({ productId }) => ({
        url: "/cart",
        method: "DELETE",
        body: { productId }, // Pass product ID in request body
      }),
      invalidatesTags: ["Cart"], // Refresh cart after deletion
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetCartItemsQuery,
  useUpdateCartItemMutation,
  useDeleteCartItemMutation,
  useAddCartItemMutation,
} = cartApi;
