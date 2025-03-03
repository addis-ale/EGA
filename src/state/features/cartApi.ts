import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Product } from "@prisma/client";

// Define a type for cart products with quantity
interface CartProduct extends Product {
  quantity: number;
}

// Define API for cart operations
export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Cart"],
  endpoints: (builder) => ({
    getCartItems: builder.query<
      { cart: CartProduct[]; totalPrice: number; totalQuantity: number },
      void
    >({
      query: () => `/cart`,
      providesTags: ["Cart"],
    }),
    addToCart: builder.mutation<void, { productId: string; quantity: number }>({
      query: ({ productId, quantity }) => ({
        url: "/cart",
        method: "POST",
        body: { productId, quantity },
      }),
      invalidatesTags: ["Cart"],
    }),
    updateCartItem: builder.mutation<
      void,
      { productId: string; quantity: number }
    >({
      query: ({ productId, quantity }) => ({
        url: "/cart",
        method: "PATCH",
        body: { productId, quantity },
      }),
      invalidatesTags: ["Cart"],
    }),
    removeFromCart: builder.mutation<void, { productId: string }>({
      query: ({ productId }) => ({
        url: "/cart",
        method: "DELETE",
        body: { productId },
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartItemsQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
} = cartApi;
